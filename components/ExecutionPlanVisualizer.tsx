import React from 'react';
import { AggregateIcon } from './icons/AggregateIcon';
import { FilterIcon } from './icons/FilterIcon';
import { JoinIcon } from './icons/JoinIcon';
import { ReturnIcon } from './icons/ReturnIcon';
import { SortIcon } from './icons/SortIcon';
import { StepIcon } from './icons/StepIcon';
import { TableScanIcon } from './icons/TableScanIcon';

interface ExecutionPlanVisualizerProps {
  plan: string[];
}

const parseStep = (step: string) => {
    const text = step.replace(/^\d+\.\s*/, '');
    const lowerText = text.toLowerCase();

    if (lowerText.includes('scan')) return { Icon: TableScanIcon, title: 'Table Scan', description: text };
    if (lowerText.includes('filter')) return { Icon: FilterIcon, title: 'Filter', description: text };
    if (lowerText.includes('join')) return { Icon: JoinIcon, title: 'Join', description: text };
    if (lowerText.includes('sort') || lowerText.includes('order by')) return { Icon: SortIcon, title: 'Sort', description: text };
    if (lowerText.includes('aggregate') || lowerText.includes('group by')) return { Icon: AggregateIcon, title: 'Aggregate', description: text };
    if (lowerText.includes('return') || lowerText.includes('output') || lowerText.includes('results')) return { Icon: ReturnIcon, title: 'Return Results', description: text };

    return { Icon: StepIcon, title: 'Operation', description: text };
};


const ExecutionPlanVisualizer: React.FC<ExecutionPlanVisualizerProps> = ({ plan }) => {
    if (!plan || plan.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col items-center font-sans">
            {plan.map((step, index) => {
                const { Icon, title, description } = parseStep(step);
                return (
                    <React.Fragment key={index}>
                        {/* Node */}
                        <div className="flex items-start gap-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg w-full max-w-md shadow-sm">
                            <div className="text-cyan-400 mt-0.5 flex-shrink-0">
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-grow">
                                <h6 className="font-semibold text-sm text-gray-200">{title}</h6>
                                <p className="text-xs text-gray-400">{description}</p>
                            </div>
                        </div>

                        {/* Connector */}
                        {index < plan.length - 1 && (
                            <div className="h-6 w-px bg-gray-600 my-1"></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default ExecutionPlanVisualizer;