import { useState, useRef, useEffect, SyntheticEvent, KeyboardEventHandler } from "react";
import { CardType } from "../types/CardType";

const PlusButton = ({
  plusButtonClicked,
  setPlusButtonClicked,
  addCard,
  cardType
}: {
  plusButtonClicked: Boolean;
  cardType: CardType;
  setPlusButtonClicked: Function;
  addCard: Function;
}) => {
  const [text, setText] = useState("");

  const onClickHandler = () => {
    setPlusButtonClicked(true);
  };

  const onBlurHandler = () => {
    setPlusButtonClicked(false);
  };

  const onKeyDownHandler = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Run Add
    }
  }

  return (
    <div>
      {!plusButtonClicked ? (
        <button
          className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center`}
          onClick={onClickHandler}
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
      ) : (
        <div className={`m-2 w-full$`}>
          <div 
            className={`border border-gray-400 bg-white rounded p-4 leading-normal`}
          >
            <div className="flex items-center justify-center">
              <div className="text-sm">
                <textarea
                  autoFocus
                  tabIndex={0}
                  value={text}
                  placeholder="Enter your text..."
                  onChange={(e) => setText(e.target.value)}
                  className="text-gray-900 leading-none focus:outline-none resize-none"
                  onKeyDown={onKeyDownHandler}
                ></textarea>
                
              </div>
            </div>
          </div>
          <button className="mt-3 mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {addCard(cardType, text); setText("")}}>Add</button>
          <button className="mt-3 mr-2 bg-transparent text-slate-700 font-bold py-2 px-4 rounded"  onClick={onBlurHandler}>Close</button>
        </div>
      )}
    </div>
  );
};

export default PlusButton;
