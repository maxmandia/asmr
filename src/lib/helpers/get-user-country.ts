export function getCountryCodeFromCoordinates(): string {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const apiKey = process.env.NEXT_PUBLIC_BIG_CLOUD_KEY;
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en&key=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        const countryCode = data.countryCode;

        return countryCode as string;
      } catch (error) {
        console.error("Failed to get country from coordinates:", error);
        return "US";
      }
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
    return "US";
  }

  return "US";
}
