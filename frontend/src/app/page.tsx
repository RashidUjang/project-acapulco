"use client";

import { useEffect, useState, useCallback } from "react";
import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { openDB, IDBPDatabase } from "idb";

import List from "./components/List";

import { CardType } from "./types/CardType";
import Habit from "./types/Habit";
import Task from "./types/Task";
import ChainList from "./components/ChainList";

const Home = () => {
  const [db, setDb] = useState<IDBPDatabase | null>(null);

  const [habits, setHabits] = useState<any>([]);
  const [sappers, setSappers] = useState<any>([]);
  const [gainers, setGainers] = useState<any>([]);
  const [rewards, setRewards] = useState<any>([]);

  useEffect(() => {
    // Helper inner method to perform async operations for IndexedDB
    const fetchDb = async () => {
      const database = await openDB("acapulco", 1, {
        upgrade(db) {
          db.createObjectStore(CardType.Gainers as unknown as string, {
            keyPath: "id",
          });
          db.createObjectStore(CardType.Sappers as unknown as string, {
            keyPath: "id",
          });
          db.createObjectStore(CardType.Rewards as unknown as string, {
            keyPath: "id",
          });
          db.createObjectStore("habits", {
            keyPath: "id",
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
    setGainers(await db?.getAll(CardType.Gainers));
    setSappers(await db?.getAll(CardType.Sappers));
    setRewards(await db?.getAll(CardType.Rewards));
    setHabits(await db?.getAll("habits"));
  };

  useEffect(() => {
    const syncStateWithIdb = async () => {
      await db?.clear(CardType.Gainers);
      await db?.clear(CardType.Sappers);
      await db?.clear(CardType.Rewards);
      await db?.clear("habits");

      gainers?.map(async (gainer: any, index: number) => {
        // TODO: Reordered state is not saved!
        // gainer.id = index;
        await db?.put(CardType.Gainers, gainer);
      });
      sappers?.map(async (sapper: any, index: number) => {
        // sapper.id = index;
        await db?.put(CardType.Sappers, sapper);
      });
      rewards?.map(async (reward: any, index: number) => {
        // reward.id = index;
        await db?.put(CardType.Rewards, reward);
      });
      habits?.map(async (habit: any, index: number) => {
        await db?.put("habits", habit);
      });
    };

    syncStateWithIdb();
  }, [gainers, sappers, rewards, habits]);

  const addCard = async (storeName: CardType, text: string) => {
    // Keygen function that determines the next available id
    let data;

    switch (storeName) {
      case CardType.Gainers:
        data = gainers;
        break;
      case CardType.Sappers:
        data = sappers;
        break;
      case CardType.Rewards:
        data = rewards;
        break;
    }

    let nextKey;

    // Determines the next key by traversing through the array and supplying the key with one higher of the highest key
    nextKey =
      data.length !== 0
        ? data.reduce((prev: any, current: any) => {
            return prev.id > current.id ? prev : current;
          }).id + 1
        : 0;

    await db?.put(storeName, { id: nextKey, text, type: storeName });
    await getAll();
  };

  const editCard = async (storeName: CardType, text: string, id: number) => {
    await db?.put(storeName, { id, text, type: storeName });
    await getAll();
  };

  const deleteCard = async (storeName: CardType, id: number) => {
    // Delete item from state
    switch (storeName) {
      case CardType.Gainers:
        setGainers((previousGainers: any) => {
          return previousGainers.filter((element: any, index: any) => {
            return element.id !== id;
          });
        });
        break;
      case CardType.Sappers:
        setSappers((previousGainers: any) => {
          return previousGainers.filter((element: any, index: any) => {
            return element.id !== id;
          });
        });
        break;
      case CardType.Rewards:
        setRewards((previousGainers: any) => {
          return previousGainers.filter((element: any, index: any) => {
            return element.id !== id;
          });
        });
        break;
    }
  };

  const deleteHabit = () => {}

  const changePosition = useCallback(
    async (
      draggedItemIndex: number,
      droppableItemIndex: number,
      type: CardType
    ) => {
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

        return copyPreviousCards;
      });
    },
    [gainers, sappers, rewards]
  );

  const addHabit = () => {
    let nextKey =
      habits.length !== 0
        ? habits.reduce((prev: any, current: any) => {
            return prev.id > current.id ? prev : current;
          }).id + 1
        : 1;
    
    setHabits((previousHabits: Habit[]) => {
      // New array needed because React performs an optimization where it performs an equality check and if it passes it doesn't re-render components. Objects are compared shallowly and thus need to be recreated.
      let newHabits = [...previousHabits];
      newHabits.push({ id: nextKey, tasks: [] });
      return newHabits
    });
  };

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
        />
        <List
          items={rewards}
          cardType={CardType.Rewards}
          changePosition={changePosition}
          addCard={addCard}
          editCard={editCard}
          deleteCard={deleteCard}
        />
      </div>

      <h2 className="m-4">Chains</h2>
      {/* <div className="flex content-start m-4 border border-gray-400 bg-white rounded p-4 leading-normal">
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
      </div> */}
      <div className="flex flex-col content-start m-4 border border-gray-400 bg-white rounded p-4 leading-normal">
        <ChainList
          habits={habits}
          setHabits={setHabits}
          addHabit={addHabit}
          deleteCard={deleteCard}
          deleteHabit={deleteHabit}
        />
      </div>
      {/* <button onClick={() => console.log(habits)}>Debug button</button> */}
    </DndProvider>
  );
};

export default Home;
