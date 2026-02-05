export interface TransferPlayer {
  id: number;
  name: string;
  position: string;
  age: number;
  rating: number;
  askingPrice: number;
  club: string;
  nationality: string;
  marketValue: number;
}

export interface TransferOffer {
  id: number;
  playerId: number;
  playerName: string;
  fromClub: string;
  toClub: string;
  offerPrice: number;
  askingPrice: number;
  status: "pending" | "accepted" | "rejected" | "countered";
  negotiationRound: number;
  maxOffer: number;
}

const PLAYER_NAMES = [
  "Cristiano", "Lionel", "Neymar", "Kylian", "Robert", "Erling", "Vinicius",
  "Jude", "Pedri", "Gavi", "Florian", "Declan", "Aurélien", "Vinícius",
  "Jamal", "Bukayo", "Phil", "Rodri", "Jorginho", "Sergio",
];

const POSITIONS = ["ST", "LW", "RW", "CAM", "CM", "CDM", "LB", "RB", "CB", "GK"];

const NATIONALITIES = [
  "Portugal", "Argentina", "Brazil", "France", "Germany", "Spain", "Italy",
  "England", "Netherlands", "Belgium", "Poland", "Uruguay", "Mexico",
];

const CLUBS = [
  "Manchester United", "Manchester City", "Liverpool", "Arsenal", "Chelsea",
  "Real Madrid", "Barcelona", "Atletico Madrid", "PSG", "Bayern Munich",
  "Juventus", "Inter Milan", "AC Milan", "Napoli",
];

export function generateTransferMarket(count: number = 50): TransferPlayer[] {
  const players: TransferPlayer[] = [];

  for (let i = 0; i < count; i++) {
    const rating = 70 + Math.random() * 30;
    const marketValue = calculateMarketValue(rating);

    players.push({
      id: i + 1,
      name: `${PLAYER_NAMES[Math.floor(Math.random() * PLAYER_NAMES.length)]} ${PLAYER_NAMES[Math.floor(Math.random() * PLAYER_NAMES.length)]}`,
      position: POSITIONS[Math.floor(Math.random() * POSITIONS.length)],
      age: 18 + Math.floor(Math.random() * 15),
      rating: Math.round(rating * 10) / 10,
      askingPrice: Math.round(marketValue * (0.9 + Math.random() * 0.3)),
      club: CLUBS[Math.floor(Math.random() * CLUBS.length)],
      nationality: NATIONALITIES[Math.floor(Math.random() * NATIONALITIES.length)],
      marketValue: Math.round(marketValue),
    });
  }

  return players.sort((a, b) => b.marketValue - a.marketValue);
}

function calculateMarketValue(rating: number): number {
  const baseValue = 1000000;
  const multiplier = Math.pow(rating / 70, 3);
  return baseValue * multiplier;
}

export function makeTransferOffer(
  player: TransferPlayer,
  yourClub: string,
  initialOffer: number
): TransferOffer {
  const askingPrice = player.askingPrice;
  const maxOffer = player.marketValue * 1.5;

  return {
    id: Math.random(),
    playerId: player.id,
    playerName: player.name,
    fromClub: player.club,
    toClub: yourClub,
    offerPrice: initialOffer,
    askingPrice: askingPrice,
    status: "pending",
    negotiationRound: 1,
    maxOffer: Math.round(maxOffer),
  };
}

export function respondToOffer(
  offer: TransferOffer,
  response: "accept" | "reject" | "counter",
  counterPrice?: number
): TransferOffer {
  if (response === "accept") {
    return {
      ...offer,
      status: "accepted",
    };
  }

  if (response === "reject") {
    return {
      ...offer,
      status: "rejected",
    };
  }

  if (response === "counter" && counterPrice) {
    const newOffer = Math.max(offer.offerPrice * 0.95, offer.askingPrice * 0.8);
    return {
      ...offer,
      offerPrice: Math.round(newOffer),
      status: "countered",
      negotiationRound: offer.negotiationRound + 1,
    };
  }

  return offer;
}

export function getAINegotiationResponse(offer: TransferOffer): "accept" | "reject" | "counter" {
  const acceptanceThreshold = offer.askingPrice * 0.95;

  if (offer.offerPrice >= acceptanceThreshold) {
    return Math.random() > 0.3 ? "accept" : "counter";
  }

  if (offer.offerPrice >= offer.askingPrice * 0.7) {
    return "counter";
  }

  return "reject";
}

export function generateCounterOffer(offer: TransferOffer): number {
  const gap = offer.askingPrice - offer.offerPrice;
  const reduction = gap * (0.3 + Math.random() * 0.2);
  return Math.round(offer.offerPrice + reduction);
}

export function filterPlayersByPosition(
  players: TransferPlayer[],
  position: string
): TransferPlayer[] {
  return players.filter((p) => p.position === position);
}

export function filterPlayersByBudget(
  players: TransferPlayer[],
  budget: number
): TransferPlayer[] {
  return players.filter((p) => p.marketValue <= budget);
}

export function filterPlayersByRating(
  players: TransferPlayer[],
  minRating: number
): TransferPlayer[] {
  return players.filter((p) => p.rating >= minRating);
}

export function searchPlayers(
  players: TransferPlayer[],
  query: string
): TransferPlayer[] {
  const lowerQuery = query.toLowerCase();
  return players.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.club.toLowerCase().includes(lowerQuery) ||
      p.nationality.toLowerCase().includes(lowerQuery)
  );
}
