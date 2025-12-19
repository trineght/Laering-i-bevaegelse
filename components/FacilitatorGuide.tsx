import React, { useState } from 'react';
import { FACILITATOR_CONTENT } from '../facilitatorConstants';
import Card from './ui/Card';

const FacilitatorGuide: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);

    const activeContent = FACILITATOR_CONTENT[activeTab];

    return (
        <Card className="!p-0 overflow-hidden">
            <div className="flex flex-col">
                <div className="p-6 sm:p-8 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-3xl font-bold text-[#464646]">Guide til facilitator</h2>
                    <p className="text-[#464646] mt-4 text-2xl">
                        Her finder du teoretisk baggrund, mødeagendaer og kvikrunden til at facilitere Læring i bevægelse - et eksperiment i didaktisk mod.
                    </p>
                </div>

                {/* Updated Navigation Bar - More distinct tabs */}
                <div className="flex overflow-x-auto bg-gray-100 p-3 gap-3 border-b border-gray-200 scrollbar-hide">
                    {FACILITATOR_CONTENT.map((item, index) => (
                        <button
                            key={item.tab}
                            onClick={() => setActiveTab(index)}
                            className={`py-3 px-6 text-lg font-bold transition-all whitespace-nowrap rounded-lg flex-shrink-0 ${
                                activeTab === index 
                                ? 'bg-[#1F7A75] text-white shadow-md' 
                                : 'bg-white text-gray-600 hover:text-[#1F7A75] hover:shadow-md border border-gray-200'
                            }`}
                            role="tab"
                            aria-selected={activeTab === index}
                        >
                            {item.tab}
                        </button>
                    ))}
                </div>

                <div className="p-6 sm:p-8">
                    <div className="prose max-w-none prose-gray text-[#464646] prose-2xl">
                        <h3 className="text-3xl font-bold text-[#1F7A75] mb-10">{activeContent.title}</h3>
                        {activeContent.content}
                    </div>
                </div>
            </div>
             <style>{`
                .prose ul.list-circle {
                    list-style-type: circle;
                }
                /* Hide scrollbar for Chrome, Safari and Opera */
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                /* Hide scrollbar for IE, Edge and Firefox */
                .scrollbar-hide {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>
        </Card>
    );
};

export default FacilitatorGuide;