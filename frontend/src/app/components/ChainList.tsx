import { MouseEventHandler, useState } from "react";

import Chain from "./Chain";
import PlusButton from "./PlusButton";
import Habit from "../types/Habit";

const ChainList = ({
  habits,
  setHabits,
  addHabit,
  deleteHabit,
  deleteCard
}: {
  habits: Habit[] | null;
  setHabits: Function;
  addHabit: MouseEventHandler;
  deleteHabit: Function;
  deleteCard: Function;
}) => {
  
  return (
    <>
      <div className="flex w-full flex-wrap content-start m-4 border border-gray-400 bg-white rounded p-4 leading-normal">
        {habits?.map((habit: Habit, index: number) => {
          return (
            <Chain
              habit={habit}
              index={index}
              setHabits={setHabits}
              deleteCard={deleteCard}
            />
          );
        })}
      </div>
      <button
        className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center`}
        onClick={addHabit}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </>
  );
};

export default ChainList;
