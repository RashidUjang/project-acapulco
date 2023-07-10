"use client";

import { useEffect, useState, useCallback } from "react";
import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { HTML5Backend } from "react-dnd-html5-backend";
import { openDB, deleteDB, wrap, unwrap, IDBPDatabase } from "idb";
import update from "immutability-helper";

import Card from "./components/Card";
import PlusButton from "./components/PlusButton";
import List from "./components/List";

import { CardType } from "./types/CardType";
import { idText } from "typescript";

const Home = () => {
  const [db, setDb] = useState<IDBPDatabase | null>(null);

  const [habits, setHabits] = useState([
    { id: 1, text: "Item 1" },
    { id: 2, text: "Item 2" },
    { id: 3, text: "Item 3" },
  ]);

  const [sappers, setSappers] = useState([
    { id: 1, text: "Item 1", type: CardType.Sappers },
    { id: 2, text: "Item 2", type: CardType.Sappers },
    { id: 3, text: "Item 1", type: CardType.Sappers },
    { id: 4, text: "Item 2", type: CardType.Sappers },
    { id: 5, text: "Item 1", type: CardType.Sappers },
    { id: 6, text: "Item 2", type: CardType.Sappers },
  ]);

  const [gainers, setGainers] = useState<any>(null);

  const [rewards, setRewards] = useState([
    { id: 5, text: "Item 5", type: CardType.Rewards },
    { id: 6, text: "Item 6", type: CardType.Rewards },
  ]);

  useEffect(() => {
    // Helper inner method to perform async operations for IndexedDB
    const fetchDb = async () => {
      const database = await openDB("acapulco", 1, {
        upgrade(db) {
          db.createObjectStore(CardType.Gainers as unknown as string, {
            keyPath: 'id'
          });
          db.createObjectStore(CardType.Sappers as unknown as string, {
            keyPath: 'id'
          });
          db.createObjectStore(CardType.Rewards as unknown as string, {
            keyPath: 'id'
          });
        },
      });
      setDb(database);
    };

    if (!db) {
      fetchDb();
    }

    getAll();
  }, []);

  useEffect(() => {
    getAll();
  }, [db]);

  const getAll = async () => {
    console.log("🚀 ~ file: page.tsx:75 ~ db?.getAll(CardType.Gainers):", await db?.getAllKeys(CardType.Gainers))

    setGainers(
      (await db?.getAll(CardType.Gainers))?.map((card, index) => {
        return { id: index, ...card };
      })
    );
  };

  const addCard = async (storeName: CardType, text: string) => {
    await db?.put(storeName, { text, type: storeName });
    await getAll();
  };

  const editCard = async (storeName: CardType, text: string, id: number) => {
    await db?.put(storeName, { text, type: storeName }, id);
    await getAll();
  };

  const deleteCard = async (storeName: CardType, id: number) => {
    console.log("🚀 ~ file: page.tsx:90 ~ deleteCard ~ storeName: CardType, id: number:", storeName, id)
    await db?.delete(storeName, id);
    await getAll();
  };

  const changePosition = useCallback(
    (draggedItemIndex: number, droppableItemIndex: number, type: CardType) => {
      let setFunction: any;

      switch (type) {
        case CardType.Gainers:
          setFunction = setGainers;
          break;
        case CardType.Sappers:
          setFunction = setSappers;
          break;
        case CardType.Rewards:
          setFunction = setRewards;
          break;
      }

      if (!setFunction) {
        return;
      }

      setFunction((previousCards: any) => {
        const copyPreviousCards = JSON.parse(JSON.stringify(previousCards));

        // Remove draggedItem from
        copyPreviousCards.splice(draggedItemIndex, 1);
        copyPreviousCards.splice(
          droppableItemIndex,
          0,
          previousCards[draggedItemIndex]
        );

        console.log(copyPreviousCards)

        return copyPreviousCards;
      });

    },
    [gainers, sappers, rewards]
  );

  // const changePosition = useCallback(
  //   (dragIndex: any, hoverIndex: any, type: CardType) => {
  //     let setFunction: any;

  //     switch (type) {
  //       case CardType.Gainers:
  //         setFunction = setGainers;
  //         break;
  //       case CardType.Sappers:
  //         setFunction = setSappers;
  //         break;
  //       case CardType.Rewards:
  //         setFunction = setRewards;
  //         break;
  //     }

  //     if (!setFunction) {
  //       return;
  //     }

  //     setFunction((prevCards: any) =>
  //       update(prevCards, {
  //         $splice: [
  //           [dragIndex, 1],
  //           [hoverIndex, 0, prevCards[dragIndex]],
  //         ],
  //       })
  //     );
  //   },
  //   []
  // );

  return (
    <DndProvider options={HTML5toTouch}>
      <h2 className="m-4">Habits</h2>
      <div className="flex flex-row">
        <List
          items={gainers}
          cardType={CardType.Gainers}
          changePosition={changePosition}
          addCard={addCard}
          editCard={editCard}
          deleteCard={deleteCard}
        />
        <List
          items={sappers}
          cardType={CardType.Sappers}
          changePosition={changePosition}
          addCard={addCard}
          editCard={editCard}
          deleteCard={deleteCard}
        ></List>
        <List
          items={rewards}
          cardType={CardType.Rewards}
          changePosition={changePosition}
          addCard={addCard}
          editCard={editCard}
          deleteCard={deleteCard}
        ></List>
      </div>

      <h2 className="m-4">Chains</h2>
      <div className="flex content-start m-4 border border-gray-400 bg-white rounded p-4 leading-normal">
        {habits.map((card, index) => {
          return (
            <Card
              key={card.id}
              id={card.id}
              cardIndex={index}
              taskTitle={card.text}
              changePosition={changePosition}
            />
          );
        })}
      </div>
      {/* <button onClick={getAll}>Debug button</button> */}
    </DndProvider>
  );
};

export default Home;
