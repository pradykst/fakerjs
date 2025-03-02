import type { LocaleDefinition } from "@faker-js/faker";
import { base, en, Faker } from "@faker-js/faker";

const middleEarthLocale: LocaleDefinition = {
  person: {
    first_name: {
      generic: ["Fangorn", "Bregalad", "Finglas", "Fladrif"],
      male: ["Frodo", "Gandalf", "Aragorn", "Legolas", "Boromir", "Elrond", "Gollum"],
      female: ["Arwen", "Galadriel", "Éowyn", "Tauriel", "Rosie", "Lobelia", "Lúthien", "Idril", "Nimrodel"],
    },
    last_name: {
      generic: ["Baggins", "Gamgee", "Brandybuck", "Took", "Greenleaf", "Oakenshield", "Ironfoot", "Stormcrow"],
    },
  },
  location: {
    city_name: ["Hobbiton", "Rivendell", "Minas Tirith", "Edoras", "Lothlórien", "Bree"],
    state: ["Gondor", "Rohan", "Mirkwood", "The Shire", "Mordor"],
  },
};

export const faker_MiddleEarth = new Faker({ locale: [middleEarthLocale, en, base] });
