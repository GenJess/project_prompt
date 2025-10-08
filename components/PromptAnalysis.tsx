import React from 'react';
import type { PromptAnalysisItem } from '../types';
import { Tooltip } from './ui/Tooltip';
import { SparklesIcon } from './icons/SparklesIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';

interface PromptAnalysisProps {
    targetPrompt: string;
    userPrompt: string;
    analysis: PromptAnalysisItem[];
}

const parameterColors: { [key: string]: string } = {
    subject: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    style: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    composition: 'bg-green-500/20 text-green-300 border border-green-500/30',
    setting: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    color: 'bg-red-500/20 text-red-300 border border-red-500/30',
    action: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    detail: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
    default: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
};

const getColorForParameter = (param: string) => {
    const lowerParam = param.toLowerCase();
    for (const key in parameterColors) {
        if (lowerParam.includes(key)) {
            return parameterColors[key];
        }
    }
    return parameterColors.default;
};

const highlightPrompt = (prompt: string, analysis: PromptAnalysisItem[], type: 'user' | 'target'): React.ReactNode[] => {
    let lastIndex = 0;
    const elements: React.ReactNode[] = [];

    const phrases = analysis
        .map(item => ({
            phrase: type === 'user' ? item.user_phrase : item.target_phrase,
            ...item
        }))
        .filter(item => item.phrase && prompt.includes(item.phrase))
        .sort((a, b) => prompt.indexOf(a.phrase) - prompt.indexOf(b.phrase));

    phrases.forEach(({ phrase, feedback, parameter }, i) => {
        const index = prompt.indexOf(phrase, lastIndex);
        if (index === -1) return;

        // Add the text before the phrase
        if (index > lastIndex) {
            elements.push(prompt.substring(lastIndex, index));
        }

        // Add the highlighted phrase in a tooltip
        elements.push(
            <Tooltip key={`${parameter}-${i}`} content={feedback}>
                <span className={`px-1 rounded-sm ${getColorForParameter(parameter)}`}>
                    {phrase}
                </span>
            </Tooltip>
        );

        lastIndex = index + phrase.length;
    });

    // Add any leftover text at the end
    if (lastIndex < prompt.length) {
        elements.push(prompt.substring(lastIndex));
    }

    return elements;
};

export const PromptAnalysis: React.FC<PromptAnalysisProps> = ({ targetPrompt, userPrompt, analysis }) => {
    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 h-full flex flex-col">
            <h2 className="text-2xl font-bold text-center text-gray-300 mb-4 flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 mr-2 text-indigo-400" />
                Prompt Analysis
            </h2>
            <div className="flex-grow space-y-6">
                <div className="font-sans text-sm p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <p className="font-bold text-green-400 mb-2 flex items-center"><CheckIcon className="w-4 h-4 mr-2" /> Target Prompt</p>
                    <p className="text-gray-300 leading-relaxed">{highlightPrompt(targetPrompt, analysis, 'target')}</p>
                </div>
                <div className="font-sans text-sm p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <p className="font-bold text-yellow-400 mb-2 flex items-center"><XIcon className="w-4 h-4 mr-2" /> Your Prompt</p>
                    <p className="text-gray-300 leading-relaxed">{highlightPrompt(userPrompt, analysis, 'user')}</p>
                </div>
            </div>
        </div>
    );
};