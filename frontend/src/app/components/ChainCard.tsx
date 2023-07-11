import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "../types/dragTypes";
import { CardType } from "../types/CardType";
import Task from "../types/Task";
import { useRef } from "react";

const ChainCard = ({ habitId, task, type, setHabits }: { habitId: number; task: Task; type: CardType; setHabits: Function; }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.HABIT,
    item: { task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
        if (!task && type === item.type) {
            console.log('match')

            return
        }

        
        // Set Habits
    }
  })



  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`w-full m-4 p-4 border ${task ? 'border-solid' : 'border-dotted text-gray-400'} border-gray-400 bg-white`}
    >
      {task ? task.text : `Drop ${type} here`}
    </div>
  );
};

export default ChainCard;
