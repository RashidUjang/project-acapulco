import ChainCard from "./ChainCard";

import { CardType } from "../types/CardType";
import Task from "../types/Task";

const Chain = ({ habit }: { habit: Task[] }) => {
  return (
    <div className="flex m-4 p-4 border border-gray-400 bg-white ">
      <ChainCard
        text={
          habit.filter((task: Task) => {
            return task.type === CardType.Gainers;
          })[0]?.text ?? "Drop a Gainer here"
        }
      />
      <ChainCard
        text={
          habit.filter((task: Task) => {
            return task.type === CardType.Sappers;
          })[0]?.text ?? "Drop a Sapper here"
        }
      />
      <ChainCard
        text={
          habit.filter((task: Task) => {
            return task.type === CardType.Rewards;
          })[0]?.text ?? "Drop a Reward here"
        }
      />
    </div>
  );
};

export default Chain;
