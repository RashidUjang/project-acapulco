import { useRef, Key, useState } from "react";
import TextareaAutoSize from "react-textarea-autosize";
import { XYCoord, useDrag, useDrop } from "react-dnd";

import { ItemTypes } from "../types/dragTypes";
import { CardType } from "../types/CardType";

const Card = ({
  key,
  id,
  taskTitle,
  cardIndex,
  changePosition,
  cardType,
  editCard,
  deleteCard,
}: {
  key: Key;
  id: number;
  taskTitle: string;
  cardIndex: number;
  changePosition: Function;
  cardType: CardType;
  editCard: Function;
  deleteCard: Function;
}) => {
  const ref = useRef<HTMLDivElement>();
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>(taskTitle);

  // Declare drag items
  const [{ handlerId, didDrop }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        didDrop: monitor.didDrop()
      };
    },
    hover(item, monitor) {
      // Type guard for ref
      if (!ref.current) {
        return;
      }

      const draggedItemIndex = item.index;
      const droppableItemIndex = cardIndex;

      if (draggedItemIndex === droppableItemIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position on hovered element
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top. Typecast to XYCoord as the result of monitor.getClientOffset() is possibly null.
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Dragging downwards. Doesn't trigger a change in position if dragging an item from the top to the bottom and has not crossed the midpoint of the element
      if (
        draggedItemIndex < droppableItemIndex &&
        hoverClientY < hoverMiddleY
      ) {
        return;
      }

      // Dragging upwards, same logic
      if (
        draggedItemIndex > droppableItemIndex &&
        hoverClientY > hoverMiddleY
      ) {
        return;
      }

      changePosition(draggedItemIndex, droppableItemIndex, item.type);

      item.index = droppableItemIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id, index: cardIndex, type: cardType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));

  const onMouseEnterHandler = () => {
    setShowControls(true);
  };

  const onMouseLeaveHandler = () => {
    setShowControls(false);
  };

  const onEditHandler = () => {
    setIsEditing(true);
  };

  const onDiscardHandler = () => {
    setIsEditing(false);
    setNewTaskTitle(taskTitle);
  };

  const onSaveHandler = () => {
    editCard(cardType, newTaskTitle, id);
    setIsEditing(false);
  };

  const onDeleteHandler = () => {
    deleteCard(cardType, id)
  }

  return (
    <div
      ref={ref}
      key={key}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      className="m-2 w-full"
    >
      <div
        className={`${
          isDragging ? "opacity-0" : "opacity-100"
        } border border-gray-400 bg-white rounded p-4 leading-normal`}
      >
        <div className="flex items-center justify-center">
          <div className="text-sm">
            {!isEditing ? (
              <p className="text-gray-900 leading-none">{taskTitle}</p>
            ) : (
              <TextareaAutoSize
                autoFocus
                value={newTaskTitle}
                onChange={(e) => {
                  setNewTaskTitle(e.target.value);
                }}
                className="overflow-hidden text-gray-900 leading-none focus:outline-none resize-none"
              ></TextareaAutoSize>
            )}
            <p className="text-gray-900 leading-none">{cardIndex.toString()}</p>
          </div>
        </div>
        {!isEditing && showControls && (
          <div>
            <button
              className="mt-3 mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={onEditHandler}
            >
              Edit
            </button>
            <button
              className="mt-3 mr-2 bg-transparent text-red-700 font-bold py-2 px-4 rounded"
              onClick={onDeleteHandler}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {isEditing && (
        <div>
          <button
            className="mt-3 mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={onSaveHandler}
          >
            Save
          </button>
          <button
            className="mt-3 mr-2 bg-transparent text-red-700 font-bold py-2 px-4 rounded"
            onClick={onDiscardHandler}
          >
            Discard
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
