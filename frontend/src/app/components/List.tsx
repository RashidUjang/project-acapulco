import { ReactNode, useState } from "react";
import Task from "../types/Task";
import Card from "./Card";
import { CardType } from "../types/CardType";
import PlusButton from "./PlusButton";

const List = ({
  items,
  changePosition,
  cardType,
  addCard,
  editCard,
  deleteCard
}: {
  items: Task[] | null;
  changePosition: Function;
  cardType: CardType;
  addCard: Function;
  editCard: Function;
  deleteCard: Function;
}) => {
  const [plusButtonClicked, setPlusButtonClicked] = useState(false);

  return (
    <div className="flex w-full flex-wrap content-start m-4 border border-gray-400 bg-white rounded p-4 leading-normal">
      {items?.map((card, index) => {
        return (
          <Card
            key={card.id}
            id={card.id}
            cardIndex={index}
            taskTitle={card.text}
            changePosition={changePosition}
            cardType={cardType}
            editCard={editCard}
            deleteCard={deleteCard}
          ></Card>
        );
      })}
      <PlusButton
        plusButtonClicked={plusButtonClicked}
        setPlusButtonClicked={setPlusButtonClicked}
        addCard={addCard}
        cardType={cardType}
      />
    </div>
  );
};

export default List;
