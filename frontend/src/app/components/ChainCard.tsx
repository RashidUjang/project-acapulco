const ChainCard = ({ text }: { text: string }) => {
  return (
    <div className="w-full m-4 p-4 border border-dotted border-gray-400 bg-white ">
      {text}
    </div>
  );
};

export default ChainCard;
