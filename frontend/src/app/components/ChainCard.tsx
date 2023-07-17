import { useDrag, useDrop } from "react-dnd";
import { useRef, useState } from "react";

import { ItemTypes } from "../types/dragTypes";
import { CardType } from "../types/CardType";
import Task from "../types/Task";
import Habit from "../types/Habit";

const ChainCard = ({
  habitId,
  task,
  type,
  setHabits,
  deleteCard,
}: {
  habitId: number;
  task: Task;
  type: CardType;
  setHabits: Function;
  deleteCard: Function;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState<boolean>(false);
  let droppable;

  const [{ getItem, isDragging }, drag] = useDrag({
    type: ItemTypes.HABIT,
    item: { task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      getItem: monitor.getItem(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
    hover(item, monitor) {
      let itemWithType = item;
      if (!task && type === (item as Task).type) {
        droppable = true;
        return;
      }

      droppable = false;
      // Set Habits
    },
    drop(item, monitor) {
      if (!task && type === (item as Task).type) {
        deleteCard((item as Task).type, (item as Task).id);

        // Update habit with the new task
        setHabits((previousHabits: Habit[]) => {
          let newItem = JSON.parse(JSON.stringify(item));
          delete newItem.index;

          previousHabits
            .find((value) => {
              return value.id === habitId;
            })
            ?.tasks.push(newItem);

          return previousHabits;
        });
      }
    },
  });

  drag(drop(ref));

  const onRemoveHandler = () => {};
  
  return (
    <div
      ref={ref}
      className={`w-full m-4 p-4 border ${
        task || (isOver && canDrop)
          ? "border-solid"
          : "border-dotted text-gray-400"
      } ${
        task || (canDrop && getItem?.type === type) ? "border-gray-400" : "border-red-400"
      }  bg-white`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div>{task ? task.text : `Drop ${type} here`}</div>
      {task && showControls && (
        <button
          className="mt-3 mr-2 bg-transparent text-red-700 font-bold py-2 px-4 rounded"
          onClick={onRemoveHandler}
        >
          Remove
        </button>
      )}
    </div>
  );
};

export default ChainCard;
