import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { MongoClient } from 'mongodb';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import type { Profile } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          await connectDB();
          
          // Find user and include password for comparison
          const user = await User.findOne({ 
            email: credentials.email.toLowerCase() 
          }).select('+password');

          if (!user) {
            throw new Error('No user found with this email');
          }

          if (!user.password) {
            throw new Error('Please use social login for this account');
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          // Return user object (password will be excluded by toJSON method)
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image || null
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      profile(profile: any) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture || null,
          role: 'patient' // Default role for OAuth users
        };
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account, profile }): Promise<JWT> {
      // Persist role and other user data in the token
      if (user && 'role' in user) {
        token.role = (user as any).role || 'patient';
        token.id = user.id;
      }
      
      // Handle OAuth users - update their role if needed
      if (account?.provider === 'google' && profile) {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: (profile as any).email });
          if (existingUser) {
            token.role = existingUser.role;
            token.id = existingUser._id.toString();
          } else {
            // Create new user for OAuth
            const newUser = await User.create({
              name: (profile as any).name,
              email: (profile as any).email,
              image: (profile as any).picture || null,
              role: 'patient',
              emailVerified: new Date()
            });
            token.role = newUser.role;
            token.id = newUser._id.toString();
          }
        } catch (error) {
          console.error('JWT callback error:', error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to appropriate dashboard based on role
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export default handler;