import { useState } from "react";

const isValidISIN = (isin: string) => {
  if (!/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(isin)) return false;

  const digits = isin
    .split("")
    .map((char) => (isNaN(parseInt(char)) ? char.charCodeAt(0) - 55 : parseInt(char, 10)))
    .join("")
    .split("")
    .reverse()
    .map(Number);

  const checksum = digits.reduce((acc, num, index) => {
    if (index % 2 === 1) num *= 2;
    return acc + (num > 9 ? num - 9 : num);
  }, 0);

  return checksum % 10 === 0;
};

const correctISIN = (isin: string) => {
  if (!/^[A-Z]{2}[A-Z0-9]{9}[0-9]?$/.test(isin.slice(0, -1))) return "Invalid Format (Valid: [A-Z]{2}[A-Z0-9]{9}[0-9])";
  const base = isin.slice(0, -1);
  for (let i = 0; i < 10; i++) {
    if (isValidISIN(base + i)) return base + i;
  }
  return "Cannot Correct";
};

const ISINValidator = () => {
  const [isin, setIsin] = useState("");
  const [valid, setValid] = useState<boolean | null>(null);
  const [corrected, setCorrected] = useState("");

  const handleValidate = () => {
    const isValid = isValidISIN(isin);
    setValid(isValid);
    if (!isValid) {
      setCorrected(correctISIN(isin));
    } else {
      setCorrected("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-xl font-bold text-center mb-4">ISIN Validator</h1>
        <input
          type="text"
          className="w-full border p-2 rounded mb-4"
          placeholder="Enter ISIN (e.g., US0378331005)"
          value={isin}
          onChange={(e) => setIsin(e.target.value.toUpperCase())}
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={handleValidate}
        >
          Validate
        </button>
        {valid !== null && (
          <div className="mt-4 p-2 text-center font-medium">
            {valid ? (
              <p className="text-green-600">✅ Valid ISIN</p>
            ) : (
              <p className="text-red-600">❌ Invalid ISIN</p>
            )}
            {!valid && corrected && (
              <p className="mt-2 text-gray-700">Suggested Correction: <span className="font-bold">{corrected}</span></p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ISINValidator;
