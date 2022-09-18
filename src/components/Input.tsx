import { useEffect, useState } from "react";
import { IndexJsonArray } from "../server/router/sec";

type InputPropsType = {
  jsonData: IndexJsonArray;
};

const Input = (props: InputPropsType) => {
  const { jsonData } = props;
  const [value, setValue] = useState("");

  return (
    <div>
      <label
        htmlFor="company"
        className="block text-sm font-medium text-gray-300"
      >
        Search company
      </label>
      <div className="flex relative mt-1 rounded-md shadow-sm space-x-4">
        <input
          type="text"
          name="company"
          id="company"
          list="companies"
          onChange={(event) => setValue(event.target.value)}
          className="px-4 py-2 rounded-md border-2 border-zinc-800 bg-neutral-900 focus:outline-none"
          placeholder="company ticker"
        />
        <datalist id="companies">
          {jsonData?.map((item) => (
            <option key={item.ticker} value={item.ticker} />
          ))}
        </datalist>
        <button
          type="submit"
          onClick={() => console.log(value)}
          className="p-2 rounded-md border-2 border-zinc-800 focus:outline-none"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Input;
