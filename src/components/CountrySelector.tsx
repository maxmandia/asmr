import { ArrowRightIcon, Cross1Icon } from "@radix-ui/react-icons";
import Overlay from "~/components/Overlay";

export default function CountrySelector({
  expressMutationHelper,
  setShowCountrySelector,
}: {
  expressMutationHelper: (countryCode: string) => void;
  setShowCountrySelector: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const countriesAndIsoCode = [
    {
      name: "🇺🇸 United States",
      code: "US",
    },
    {
      name: "🇨🇦 Canada",
      code: "CA",
    },
    {
      name: "🇬🇧 United Kingdom",
      code: "GB",
    },
  ];

  return (
    <Overlay>
      <div className="rounded-xl bg-input p-6 px-8">
        <div className="flex items-center justify-center gap-[50px] md:gap-[100px]">
          <span className="text-[20px] font-medium">Select a country</span>
          <button
            onClick={() => setShowCountrySelector(false)}
            className="rounded-md p-2 hover:bg-input_hover"
          >
            <Cross1Icon />
          </button>
        </div>
        <div className="flex flex-col gap-2 py-2">
          {countriesAndIsoCode.map((country, index) => (
            <button
              onClick={() => {
                expressMutationHelper(country.code);
                setShowCountrySelector(false);
              }}
              className="flex items-center justify-between rounded-xl p-2 text-left hover:bg-input_hover"
              key={index}
            >
              <span>{country.name}</span>
              <ArrowRightIcon />
            </button>
          ))}
        </div>
      </div>
    </Overlay>
  );
}
