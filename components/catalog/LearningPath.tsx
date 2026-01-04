'use client';

import { ITraining } from '@/models/Training';
import { ILearningPath } from '@/models/LearningPath';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { useState } from 'react';

interface LearningPathProps {
    title?: string; // e.g. "SA Islamic Skill Deck"
    frequency?: string; // Top-level frequency
    trainings: ITraining[];
    onSelectTraining: (t: ITraining) => void;
}

const LearningPath = ({ title, frequency, trainings, onSelectTraining }: LearningPathProps) => {

    return (
        <div className="w-full max-w-7xl mx-auto py-8">
            <div className="border border-zinc-300 bg-white shadow-sm overflow-hidden">
                {/* Header Row */}
                <div className="bg-[#FFFF00] border-b border-zinc-300 py-2 px-4 text-center font-bold text-black border-l-4 border-l-transparent">
                    {/* Yellow Header (based on image mock but user said Green? User said "Green one is the designation... SA Islamic Skill Deck" but image shows yellow headers 'Learning Path 2' etc. 
                    Wait, let's look at the image again. 
                    The uploaded image 1 has a Yellow "Learning Path 2" header, and below it a Green-ish row "SA Islamic Skills Deck" spanning the first column?
                    Actually, looking at the layout:
                    Row 1 (Yellow): "Learning Path 2" (Title?)
                    Row 2 (Green-ish): "SA Islamic Skills Deck" (Col 1), "Course Overview" (Col 2), "Frequency" (Col 3)
                    Row 3+: Content
                    
                    The user said: "in Learning Path there will be like the the Green one is the designation like for this designation the learningPath is like 'SA Islamic Skill Deck' so SA is designation Islamic Skill Deck is Path name"
                    
                    So the Green row is the header for the specific path?
                    Let's try to replicate the table structure.
                    
                    Table Structure:
                    | Col 1 (Learning Path Name) | Col 2 (Course Overview) | Col 3 (Frequency) |
                    
                    The first cell of the header row is the Learning Path Name (e.g., "SA Islamic Skill Deck").
                    The second cell is "Course Overview".
                    The third cell is "Frequency".
                    
                    Then rows of trainings below it.
                    */}

                    {/* 
                     Actually, let's stick to a cleaner table structure that achieves the goal:
                     Header: [Path Name] | Course Overview | Frequency
                     Rows: [Training Name] | [Description] | [Frequency]
                     
                     Wait, the image has "SA Islamic Skills Deck" as a HEADER for the first column? 
                     And then under it lists trainings?
                     
                     Let's do:
                     <Table>
                       <Head>
                         <Row>
                           <HeaderCell className="bg-green-200">{title || 'Learning Path'}</HeaderCell>
                           <HeaderCell className="bg-green-200">Course Overview</HeaderCell>
                           <HeaderCell className="bg-green-200">Frequency</HeaderCell>
                         </Row>
                       </Head>
                       <Body>
                         {trainings.map...}
                       </Body>
                     </Table>
                     
                     The user said "Green one is the designation...". 
                     I'll use a light green background for the header row.
                     */}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-[#D1FAE5] text-zinc-900 border-b border-zinc-300">
                                <th className="py-3 px-4 font-bold w-1/4 border-r border-zinc-300">
                                    <div className="flex flex-col">
                                        <span>{title || 'Learning Path'}</span>
                                        {frequency && (
                                            <span className="text-xs font-normal text-zinc-600 mt-1">
                                                Frequency: {frequency}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th className="py-3 px-4 font-bold w-1/2 border-r border-zinc-300 text-center">
                                    Course Overview
                                </th>
                                <th className="py-3 px-4 font-bold w-1/4 text-center">
                                    Frequency
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                            {trainings.map((training, index) => (
                                <tr
                                    key={training._id as unknown as string}
                                    className="hover:bg-zinc-50 transition-colors group cursor-pointer"
                                    onClick={() => onSelectTraining(training)}
                                >
                                    <td className="py-3 px-4 border-r border-zinc-200 align-top font-medium text-zinc-900 group-hover:text-teal-600 transition-colors">
                                        {training.programTitle}
                                    </td>
                                    <td className="py-3 px-4 border-r border-zinc-200 align-top text-zinc-600 space-y-2">
                                        <div className="line-clamp-4 leading-relaxed whitespace-pre-line">
                                            {training.outcomesBenefits || training.programObjective || '-'}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 align-top text-center text-zinc-600 whitespace-nowrap">
                                        {training.frequency || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LearningPath;
