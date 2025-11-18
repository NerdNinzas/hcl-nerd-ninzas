import { Activity } from 'lucide-react';
import { Goal } from './types';

interface GoalsTabProps {
  goals: Goal[];
  isLoading: boolean;
  onMarkProgress: (goalId: string, value: number, note?: string) => void;
}

export function GoalsTab({ goals, isLoading, onMarkProgress }: GoalsTabProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Activity className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No goals assigned yet</h3>
        <p className="mt-1 text-sm text-gray-500">Your doctor will assign health goals for you to track.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {goals.map((goal) => {
        const completionPercentage = Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
        const isCompleted = goal.status === 'completed';
        
        return (
          <div key={goal._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                <p className="text-sm text-gray-600">
                  Assigned by Dr. {goal.provider?.name}
                </p>
                {goal.description && (
                  <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
                )}
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {isCompleted ? 'Completed' : goal.frequency}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">
                  Progress: {goal.currentValue} / {goal.targetValue} {goal.unit}
                </span>
                <span className="font-medium text-gray-900">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>

            {goal.endDate && (
              <p className="text-xs text-gray-500 mb-3">
                Target date: {new Date(goal.endDate).toLocaleDateString()}
              </p>
            )}

            {!isCompleted && (
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  placeholder={`Add ${goal.unit}...`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  id={`progress-${goal._id}`}
                  min="0"
                  step="any"
                />
                <button
                  onClick={() => {
                    const input = document.getElementById(`progress-${goal._id}`) as HTMLInputElement;
                    const value = parseFloat(input.value);
                    if (value && value > 0) {
                      onMarkProgress(goal._id, value);
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Mark Progress
                </button>
              </div>
            )}

            {/* Recent Progress */}
            {goal.progress && goal.progress.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Progress</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {goal.progress.slice(-5).reverse().map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">
                        +{p.value} {goal.unit}
                        {p.note && ` - ${p.note}`}
                      </span>
                      <span className="text-gray-400">
                        {new Date(p.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
