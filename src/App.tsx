import { useState, useEffect } from "react";
import exItems from "./ex.json";
import "./App.css";

// Định nghĩa kiểu dữ liệu cho một mục ex
type MyExType = {
  id: number;
  src: string;
  alt: string; // Thêm alt cho hình ảnh
  matched: boolean;
};

function Card({ myEx, flipped, chooseCard }: { myEx: MyExType; flipped: boolean; chooseCard: (myEx: MyExType) => void }) {
  const cardClickHandle = () => {
    chooseCard(myEx);
  };

  return (
    <div
      className={`card ${flipped ? "matched" : ""}`}
      onClick={cardClickHandle}
    >
      <img
        style={{ transform: "rotateY(180deg)" }}
        src={myEx.src}
        alt={myEx.alt}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-heart-question"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M14.105 17.915l-2.105 2.085l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 0 1 8.524 5.127" />
        <path d="M19 22v.01" />
        <path d="M19 19a2.003 2.003 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" />
      </svg>
    </div>
  );
}

function App() {
  const [ex, setEx] = useState<MyExType[]>([]); // Sử dụng kiểu dữ liệu MyExType[]
  const [myExOne, setMyExOne] = useState<MyExType | null>(null); // Sử dụng kiểu dữ liệu MyExType hoặc null
  const [myExTwo, setMyExTwo] = useState<MyExType | null>(null); // Sử dụng kiểu dữ liệu MyExType hoặc null
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false); // Sử dụng kiểu boolean

  const initGame = () => {
    const allEx = [...exItems].sort(() => Math.random() - 0.5) as MyExType[]; // Ép kiểu thành MyExType[]
    setEx(allEx);
    setIsGameComplete(false);
  };

  const resetGame = () => {
    setEx((prevEx) => {
      return prevEx.map((item) => ({ ...item, matched: false }));
    });
    initGame();
  };

  const chooseCard = (myEx: MyExType) => {
    if (myExOne && myExTwo) {
      return;
    }
    myExOne ? setMyExTwo(myEx) : setMyExOne(myEx);
  };

  useEffect(() => {
    if (myExOne && myExTwo) {
      const combinations = [
        [1, 9],
        [9, 1],
        [2, 12],
        [12, 2],
        [4, 11],
        [11, 4],
        [3, 7],
        [7, 3],
        [5, 8],
        [8, 5],
        [6, 10],
        [10, 6],
      ];
      const isMatched = combinations.some(
        ([id1, id2]) => myExOne.id === id1 && myExTwo.id === id2
      );
      if (isMatched) {
        setEx((prevEx) => {
          return prevEx.map((item) => {
            if (item.src === myExOne.src || item.src === myExTwo.src) {
              return { ...item, matched: true };
            } else {
              return item;
            }
          });
        });
      }
      setTimeout(() => {
        setMyExOne(null);
        setMyExTwo(null);
      }, 500);
    }
  }, [myExOne, myExTwo]);

  useEffect(() => {
    if (myExOne && myExTwo) {
      const allMatched = ex.every((item) => item.matched);
      if (allMatched) {
        setIsGameComplete(true);
      }
    }
  }, [myExOne, myExTwo, ex]);

  return (
    <>
      <h1>Who Is Whose Ex-Boyfriend? Game</h1>
      {isGameComplete ? (
        <div className="congratulations">
          <h2>DM TUYET VOI!</h2>
          <p>Your ex-boyfriend is so fucking proud of you!</p>
          <button onClick={initGame} className="start-game">
            Play Again
          </button>
        </div>
      ) : (
        <>
          {ex.length ? (
            <>
              <button onClick={resetGame} className="reset">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-reload"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                  <path d="M20 4v5h-5" />
                </svg>
              </button>

              <div className="game-block">
                {ex.map((myEx, key) => {
                  return (
                    <Card
                      key={key}
                      myEx={myEx}
                      chooseCard={chooseCard}
                      flipped={
                        (myExOne && myExOne.id === myEx.id) ||
                        (myExTwo && myExTwo.id === myEx.id) ||
                        myEx.matched
                      }
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <button onClick={initGame} className="start-game">
              Start Game
            </button>
          )}
        </>
      )}
    </>
  );
}

export default App;
