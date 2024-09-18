"use client";

import React from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Image from "next/image";

// Props types
interface Ingredient {
    id: string;
    name: string;
    image: string;
}

interface Composition {
    id: string;
    ingredient: Ingredient;
    quantity: number;
    measureUnity: string;
}

interface Tool {
    id: string;
    name: string;
    image: string;
}

interface ToolRecipe {
    id: string;
    tool: Tool;
}

interface IngredientsToolsTabsProps {
  compositions: Composition[];    // Array of ingredients and their quantities
  toolsRecipe: ToolRecipe[];       // Array of tools required for the recipe
}

const IngredientsToolsTabs: React.FC<IngredientsToolsTabsProps> = ({ compositions, toolsRecipe }) => {
    return (
        <TabGroup className="border border-slate-200 dark:border-slate-800 rounded-lg">
            <TabList className="flex flex-wrap bg-slate-200 dark:bg-slate-800 p-2 rounded-lg">
                <Tab
                    className={({ selected }) =>
                        `w-full sm:w-auto px-4 py-2 rounded-lg ${
                        selected ? "bg-gradient-to-r from-custom-orange to-[#f78b6d] text-white focus:outline-none" : ""
                        }`
                    }
                >
                Ingredients
                </Tab>
                <Tab
                    className={({ selected }) =>
                        `w-full sm:w-auto px-4 py-2 rounded-lg ${
                        selected ? "bg-gradient-to-r from-custom-orange to-[#f78b6d] text-white focus:outline-none" : ""
                        }`
                    }
                >
                Tools
                </Tab>
            </TabList>

            <TabPanels>
                {/* Ingredients Panel */}
                <TabPanel className="p-6">
                    <div className="flex flex-col sm:flex-wrap sm:flex-row gap-3">
                        {compositions.map((composition) => (
                        <div
                            className="flex flex-wrap sm:flex-col justify-between sm:justify-start text-right sm:gap-0 items-center sm:w-[100px] sm:text-center border-b border-gray-300 dark:border-gray-600 last:border-none sm:border-none pb-3"
                            key={composition.id}
                        >
                            <div className="sm:h-[100px] sm:w-[100px] overflow-hidden rounded-lg shadow-md">
                                <Image
                                    src={composition.ingredient.image}
                                    alt={composition.ingredient.name}
                                    height={200}
                                    width={200}
                                    className="w-[100px] h-[100px] object-cover sm:w-full sm:h-full hover:scale-105 transition duration-300"
                                />
                            </div>
                            <p className="sm:mt-2">
                                <span className="font-bold">{composition.ingredient.name}</span>
                                <br />
                                <span className="font-thin text-sm">
                                    {composition.quantity} {composition.measureUnity}
                                </span>
                            </p>
                        </div>
                        ))}
                    </div>
                </TabPanel>

                {/* Tools Panel */}
                <TabPanel className="p-6">
                    <div className="flex flex-col sm:flex-wrap sm:flex-row gap-3">
                        {toolsRecipe && toolsRecipe.length > 0 ? (
                        toolsRecipe.map((toolRecipe) => (
                            <div
                                className="flex flex-wrap sm:flex-col justify-between sm:justify-start text-right sm:gap-0 items-center sm:w-[100px] sm:text-center border-b border-gray-300 dark:border-gray-600 last:border-none sm:border-none pb-3"
                                key={toolRecipe.id}
                            >
                            <div className="sm:h-[100px] sm:w-[100px] overflow-hidden rounded-lg shadow-md">
                                <Image
                                    src={toolRecipe.tool.image}
                                    alt={toolRecipe.tool.name}
                                    height={200}
                                    width={200}
                                    className="w-[100px] h-[100px] object-cover sm:w-full sm:h-full hover:scale-105 transition duration-300"
                                />
                            </div>
                            <p className="sm:mt-2">
                                <span className="font-bold">{toolRecipe.tool.name}</span>
                            </p>
                            </div>
                        ))
                        ) : (
                            <p className="text-xs text-slate-400">No tools</p>
                        )}
                    </div>
                </TabPanel>
            </TabPanels>
        </TabGroup>
    );
};

export default IngredientsToolsTabs;
