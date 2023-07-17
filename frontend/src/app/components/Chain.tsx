import ChainCard from "./ChainCard";

import { CardType } from "../types/CardType";
import Habit from "../types/Habit";
import Task from "../types/Task";

const Chain = ({
  habit,
  index,
  setHabits,
  deleteCard,
}: {
  habit: Habit;
  index: number;
  setHabits: Function;
  deleteCard: Function;
}) => {
  return (
    <div className="flex m-4 p-4 border border-gray-400 bg-white ">
      <ChainCard
        habitId={habit.id}
        task={
          habit.tasks.filter((task: Task) => {
            return task.type === CardType.Gainers;
          })[0]
        }
        type={CardType.Gainers}
        setHabits={setHabits}
        deleteCard={deleteCard}
      />
      <ChainCard
        habitId={habit.id}
        task={
          habit.tasks.filter((task: Task) => {
            return task.type === CardType.Sappers;
          })[0]
        }
        type={CardType.Sappers}
        setHabits={setHabits}
        deleteCard={deleteCard}
      />
      <ChainCard
        habitId={habit.id}
        task={
          habit.tasks.filter((task: Task) => {
            return task.type === CardType.Rewards;
          })[0]
        }
        type={CardType.Rewards}
        setHabits={setHabits}
        deleteCard={deleteCard}
      />
    </div>
  );
};

export default Chain;
