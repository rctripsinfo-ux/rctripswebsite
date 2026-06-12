import React, { useEffect, useRef, useState } from "react";
import { Building2, CalendarDays, Clock3, Globe2, HeartPulse, Lightbulb, MapPin, Package, Pill, ShieldCheck, Target, Cpu } from "lucide-react";

const img = {
  cphiBanner: "https://images.unsplash.com/photo-1581093458791-9d15482442f6?auto=format&fit=crop&w=1800&q=85",
  hero: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=85",
  city: "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?auto=format&fit=crop&w=900&q=80",
  expo: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80",
  flight: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80",
  hotelRoom: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
  hotelLobby: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80"
};

const fairs = [
  { name: "CPHI China & PMEC China 2026", date: "16-18 June 2026", city: "Shanghai, China", price: 63500, tag: "Pharma" },
  { name: "Aluminium China 2026", date: "08-10 July 2026", city: "Shanghai, China", price: 115000, tag: "Metal" },
  { name: "Copper China 2026", date: "08-10 July 2026", city: "Shanghai, China", price: 95000, tag: "Copper" },
  { name: "Automechanika Shanghai 2026", date: "02-05 Dec 2026", city: "Shanghai, China", price: 75000, tag: "Auto" },
  { name: "RubberTech China 2026", date: "17-19 Sept 2026", city: "Shanghai, China", price: 175000, tag: "Rubber" },
  { name: "Canton Fair 2026", date: "April-May 2026", city: "Guangzhou, China", price: 0, tag: "Multi Sector" }
];

const packages = [
  { id: "delhi", title: "CPHI China From Delhi", date: "14-18 June 2026", price: 128000, city: "Delhi", badge: "Best Price", packageType: "flight", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=85" },
  { id: "mumbai", title: "CPHI China From Mumbai", date: "14-18 June 2026", price: 119000, city: "Mumbai", badge: "Recommended", packageType: "flight", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85" },
  { id: "hyderabad", title: "CPHI China From Hyderabad", date: "14-18 June 2026", price: 133000, city: "Hyderabad", badge: "Fast Filling", packageType: "flight", image: "https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=900&q=85" },
  { id: "bangalore", title: "CPHI China From Bangalore", date: "14-18 June 2026", price: 137500, city: "Bangalore", badge: "New Route", packageType: "flight", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=85" },
  { id: "chennai", title: "CPHI China From Chennai", date: "14-18 June 2026", price: 131000, city: "Chennai", badge: "Limited Seats", packageType: "flight", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=85" },
  { id: "land1", title: "Land Package 1", date: "14-18 June 2026", price: 63500, city: "Own Flight", badge: "Land Only", packageType: "land", image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=85" }
];

const flightsByPackage = {
  delhi: [
    { id: "del-ai", airline: "Air India", logo: "AI", flightNo: "AI 348 + AI 349", price: 0, route: "DEL - PVG - DEL", outbound: "15 Jun, 11:00 DEL to 19:20 PVG", inbound: "19 Jun, 21:15 PVG to 02:15 DEL", baggage: "23kg check-in + 7kg cabin" },
    { id: "del-cx", airline: "Cathay Pacific", logo: "CX", flightNo: "CX 694 + CX 360", price: 8500, route: "DEL - HKG - PVG - DEL", outbound: "15 Jun, 01:10 DEL to 15:30 PVG", inbound: "19 Jun, 17:45 PVG to 23:55 DEL", baggage: "23kg check-in + 7kg cabin" }
  ],
  mumbai: [
    { id: "bom-cx", airline: "Cathay Pacific", logo: "CX", flightNo: "CX 660 + CX 360", price: 0, route: "BOM - HKG - PVG", outbound: "15 Jun, 01:25 BOM to 15:30 PVG", inbound: "19 Jun, 17:45 PVG to 00:50 BOM", baggage: "23kg check-in + 7kg cabin" },
    { id: "bom-sq", airline: "Singapore Airlines", logo: "SQ", flightNo: "SQ 421 + SQ 830", price: 12300, route: "BOM - SIN - PVG", outbound: "15 Jun, 11:45 BOM to 22:45 PVG", inbound: "19 Jun, 16:50 PVG to 23:40 BOM", baggage: "25kg check-in + 7kg cabin" },
    { id: "bom-mu", airline: "China Eastern", logo: "MU", flightNo: "MU 544 + MU 543", price: 6200, route: "BOM - PVG - BOM", outbound: "15 Jun, 05:50 BOM to 14:05 PVG", inbound: "19 Jun, 20:20 PVG to 01:15 BOM", baggage: "23kg check-in + 7kg cabin" }
  ],
  hyderabad: [
    { id: "hyd-tg", airline: "Thai Airways", logo: "TG", flightNo: "TG 330 + TG 664", price: 0, route: "HYD - BKK - PVG", outbound: "15 Jun, 01:10 HYD to 16:00 PVG", inbound: "19 Jun, 17:25 PVG to 23:50 HYD", baggage: "23kg check-in + 7kg cabin" },
    { id: "hyd-sq", airline: "Singapore Airlines", logo: "SQ", flightNo: "SQ 523 + SQ 830", price: 9800, route: "HYD - SIN - PVG", outbound: "15 Jun, 11:20 HYD to 22:45 PVG", inbound: "19 Jun, 16:50 PVG to 23:05 HYD", baggage: "25kg check-in + 7kg cabin" }
  ],
  bangalore: [
    { id: "blr-sq", airline: "Singapore Airlines", logo: "SQ", flightNo: "SQ 509 + SQ 830", price: 0, route: "BLR - SIN - PVG", outbound: "15 Jun, 11:35 BLR to 22:45 PVG", inbound: "19 Jun, 16:50 PVG to 23:20 BLR", baggage: "25kg check-in + 7kg cabin" },
    { id: "blr-tg", airline: "Thai Airways", logo: "TG", flightNo: "TG 326 + TG 664", price: 7600, route: "BLR - BKK - PVG", outbound: "15 Jun, 00:30 BLR to 16:00 PVG", inbound: "19 Jun, 17:25 PVG to 00:10 BLR", baggage: "23kg check-in + 7kg cabin" }
  ],
  chennai: [
    { id: "maa-sq", airline: "Singapore Airlines", logo: "SQ", flightNo: "SQ 529 + SQ 830", price: 0, route: "MAA - SIN - PVG", outbound: "15 Jun, 10:30 MAA to 22:45 PVG", inbound: "19 Jun, 16:50 PVG to 22:40 MAA", baggage: "25kg check-in + 7kg cabin" },
    { id: "maa-tg", airline: "Thai Airways", logo: "TG", flightNo: "TG 338 + TG 664", price: 6800, route: "MAA - BKK - PVG", outbound: "15 Jun, 01:10 MAA to 16:00 PVG", inbound: "19 Jun, 17:25 PVG to 23:35 MAA", baggage: "23kg check-in + 7kg cabin" }
  ],
  land1: [
    { id: "own-flight", airline: "Own Flight", logo: "OWN", flightNo: "Not Included", price: 0, route: "Guest arranges own flight", outbound: "Share arrival timing with RC Trips", inbound: "Share departure timing with RC Trips", baggage: "As per guest airline" }
  ]
};

function getTourIncludes(pkg, flight, hotel) {
  const isLandPackage = pkg.packageType === "land" || flight.id === "own-flight";

  if (isLandPackage) {
    return [
      { title: "Tour Manager", text: "RC Trips experienced tour manager support during group movement" },
      { title: "Hotel", text: hotel.name },
      { title: "Transfers", text: "Hotel and exhibition venue transfers" },
      { title: "Meals", text: "Breakfast and Indian meal support as per package" },
      { title: "Sightseeing", text: "City experience subject to package plan and group timing" },
      { title: "Visa", text: "Visa documentation assistance available" }
    ];
  }

  return [
    { title: "Tour Manager", text: "RC Trips experienced tour manager throughout journey" },
    { title: "Flight", text: flight.airline + " air travel" },
    { title: "Hotel", text: hotel.name },
    { title: "Transfers", text: "Airport, hotel and exhibition transfers" },
    { title: "Meals", text: "Breakfast and Indian meal support" },
    { title: "Baggage", text: flight.baggage },
    { title: "Sightseeing", text: "Guided city orientation subject to timing" },
    { title: "Visa", text: "Visa documentation assistance" }
  ];
}

const hotels = [
  {
    id: "howard",
    name: "Howard Johnson by Wyndham Leonora Plaza Shanghai",
    rating: "4 Star or Similar",
    image: img.hotelRoom,
    gallery: [img.hotelRoom, img.hotelLobby, img.city, img.expo],
    twin: 0,
    single: 19500,
    location: "888 Century Avenue, Pudong, Shanghai",
    rooms: "Luxurious and spacious rooms with premium bedding, Smart TV, air conditioning, minibar, work desk and modern Shanghai-inspired decor.",
    facilities: "Free high-speed WiFi, 24-hour front desk, fitness center, business and meeting spaces, concierge service, luggage storage and self-laundry.",
    nearby: "Shanghai Tower, Oriental Pearl Tower, Shanghai World Financial Center, Century Park, Yu Garden and convenient metro access via Lujiazui Station.",
    dining: "On-site restaurant serving Chinese and international cuisine, buffet breakfast, cafe lounge and room service options."
  },
  {
    id: "radisson",
    name: "Radisson Blu Shanghai Pudong Jinqiao",
    rating: "4 Star or Similar",
    image: img.hotelLobby,
    gallery: [img.hotelLobby, img.hotelRoom, img.expo, img.city],
    twin: 7000,
    single: 21500,
    location: "2449 Jinhai Rd, Pudong, Shanghai, China, 201209",
    rooms: "Contemporary, well-appointed rooms and suites featuring premium bedding, Smart TV, air conditioning, minibar, work desk, floor-to-ceiling windows and modern European-inspired decor.",
    facilities: "Free high-speed WiFi, 24-hour front desk, fitness center, indoor swimming pool, business and meeting facilities, concierge service and luggage storage.",
    nearby: "Oriental Pearl Tower, Shanghai Tower, Shanghai World Financial Center, Riverside Promenade, Super Brand Mall and convenient metro access.",
    dining: "Multiple on-site dining venues offering Chinese and international cuisine, daily buffet breakfast, stylish bar lounge and in-room dining services."
  }
];

function inr(value, zeroText) {
  const amount = Number(value || 0);
  if (!amount) return zeroText || "₹0";
  return "₹" + amount.toLocaleString("en-IN");
}

function cls() {
  return Array.from(arguments).filter(Boolean).join(" ");
}

function createCompanyDetails() {
  return { tds: false, name: "", email: "", mobile: "", address: "", nationality: "Indian", gst: "", pan: "", gstState: "" };
}

function createTravellerDetails() {
  return { name: "", email: "", contact: "", nationality: "Indian", passport: "", pan: "", dob: "", meal: "Veg" };
}

function couponDiscountFromCode(coupon) {
  return String(coupon || "").trim().toUpperCase() === "WELCOME500" ? 500 : 0;
}

function totals(data) {
  const travellerCount = Math.max(1, Number(data.travellerCount) || 1);
  let base;
  if (data.allocationMode === "different" && data.allocations && data.allocations.length) {
    base = data.allocations.slice(0, travellerCount).reduce((sum, allocation) => {
      const pkg = packages.find((item) => item.id === allocation.pkgId) || data.pkg;
      const flights = flightsByPackage[pkg.id] || flightsByPackage.land1;
      const flight = flights.find((item) => item.id === allocation.flightId) || flights[0] || data.flight;
      const hotel = hotels.find((item) => item.id === allocation.hotelId) || data.hotel;
      const occupancyCharge = allocation.occupancy === "single" ? hotel.single : hotel.twin;
      return sum + pkg.price + flight.price + occupancyCharge;
    }, 0);
  } else {
    const occupancyCharge = data.occupancy === "single" ? data.hotel.single : data.hotel.twin;
    base = (data.pkg.price + data.flight.price + occupancyCharge) * travellerCount;
  }
  const igst = Math.round(base * 0.05);
  const tcs = Math.round(base * 0.02);
  const coupon = data.couponApplied ? couponDiscountFromCode(data.coupon) : 0;
  const fullDiscount = data.paymentType === "full" ? 5000 : 0;
  const total = Math.max(0, base + igst + tcs - coupon - fullDiscount);
  const payableNow = data.paymentType === "partial" ? Math.round(total * 0.5) : total;
  return { base, igst, tcs, coupon, fullDiscount, total, payableNow, balance: total - payableNow };
}

function runTests() {
  console.assert(inr(63500) === "₹63,500", "INR format should work");
  console.assert(inr(0) === "₹0", "Zero value should work");
  const t = totals({ pkg: { price: 100000 }, flight: { price: 10000 }, hotel: { twin: 5000, single: 15000 }, occupancy: "twin", travellerCount: 2, coupon: "WELCOME500", couponApplied: true, paymentType: "full" });
  console.assert(t.base === 230000, "Base should include package, flight, hotel and travellers");
  console.assert(t.coupon === 500, "Coupon should apply");
  console.assert(t.fullDiscount === 5000, "Full payment discount should apply");
  const p = totals({ pkg: { price: 100000 }, flight: { price: 0 }, hotel: { twin: 0, single: 0 }, occupancy: "twin", travellerCount: 1, couponApplied: false, paymentType: "partial" });
  console.assert(p.payableNow === Math.round(p.total * 0.5), "Partial payment should be 50 percent");
  const s = totals({ pkg: { price: 100000 }, flight: { price: 0 }, hotel: { twin: 0, single: 20000 }, occupancy: "single", travellerCount: 1, couponApplied: false, paymentType: "partial" });
  console.assert(s.base === 120000, "Single occupancy should add single room charge");
}

runTests();

function SmartImage(props) {
  const [failed, setFailed] = useState(false);
  if (failed || !props.src) {
    return (
      <div className={cls("flex items-center justify-center bg-gradient-to-br from-[#3f0b10] via-[#b51f29] to-[#ead0d3] text-center text-white", props.className)}>
        <div className="px-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">RC Trips</p>
          <p className="mt-2 text-sm font-bold">Image Preview</p>
        </div>
      </div>
    );
  }
  return <img {...props} onError={() => setFailed(true)} />;
}

function Header(props) {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <button type="button" onClick={() => props.setPage("home")} className="flex items-center gap-3">
          <div className="rounded bg-[#b51f29] px-3 py-2 text-xl font-bold text-white">RC<span className="text-xs">TRIPS</span></div>
          <span className="hidden text-sm font-semibold text-slate-600 md:block">Trade Fair Delegations Since 2007</span>
        </button>
        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
          <button type="button" onClick={() => props.setPage("home")} className={props.page === "home" ? "text-[#b51f29]" : "text-slate-700"}>Home</button>
          <button type="button" onClick={() => props.setPage("listing")} className={props.page === "listing" ? "text-[#b51f29]" : "text-slate-700"}>Trade Fairs</button>
          <button type="button">Tours</button>
          <button type="button" onClick={() => props.setPage("mice")} className={props.page === "mice" ? "text-[#b51f29]" : "text-slate-700"}>MICE</button>
          <button type="button">Visa</button>
          <button type="button">Contact</button>
        </nav>
        <button type="button" className="rounded-full bg-[#3f0b10] px-4 py-2 text-sm font-bold text-white">☎ +91-7290012474</button>
      </div>
    </header>
  );
}

function MicePage() {
  const micePackages = [
    {
      name: "Bali Incentive Tour",
      duration: "4N / 5D",
      group: "40+ Pax",
      price: 41674,
      type: "Incentive Tour",
      image: img.hotelLobby,
      highlights: ["Luxury Resort", "Gala Dinner", "Team Activities"]
    },
    {
      name: "Thailand Corporate Retreat",
      duration: "4N / 5D",
      group: "35+ Pax",
      price: 35630,
      type: "Corporate Retreat",
      image: img.hero,
      highlights: ["Bangkok & Pattaya", "Indian Meals", "Team Building"]
    },
    {
      name: "TRIO GEM Tour",
      duration: "6N / 7D",
      group: "50+ Pax",
      price: 54630,
      type: "International Combo",
      image: img.city,
      highlights: ["Singapore", "Malaysia", "Thailand"]
    },
    {
      name: "Dubai Dealer Meet",
      duration: "3N / 4D",
      group: "50+ Pax",
      price: 72500,
      type: "Dealer Meet",
      image: img.expo,
      highlights: ["Luxury Venue", "Conference", "Awards Night"]
    },
    {
      name: "Vietnam Corporate Escape",
      duration: "5N / 6D",
      group: "30+ Pax",
      price: 48900,
      type: "Incentive Tour",
      image: img.hero,
      highlights: ["Da Nang", "Hoi An", "Beach Resort"]
    },
    {
      name: "Maldives Executive Retreat",
      duration: "3N / 4D",
      group: "20+ Pax",
      price: 89900,
      type: "Luxury Retreat",
      image: img.hotelLobby,
      highlights: ["Water Villas", "Private Dinner", "Luxury Stay"]
    },
    {
      name: "Baku Business Leisure Tour",
      duration: "6N / 7D",
      group: "25+ Pax",
      price: 52900,
      type: "Business + Leisure",
      image: img.city,
      highlights: ["Old City", "Gabala", "Cable Car"]
    },
    {
      name: "Mauritius Incentive Program",
      duration: "5N / 6D",
      group: "30+ Pax",
      price: 96800,
      type: "Luxury Incentive",
      image: img.expo,
      highlights: ["Island Tours", "Luxury Resort", "Corporate Events"]
    },
    {
      name: "Singapore Leadership Summit",
      duration: "4N / 5D",
      group: "45+ Pax",
      price: 78900,
      type: "Leadership Summit",
      image: img.city,
      highlights: ["Marina Bay", "Corporate Sessions", "City Tours"]
    },
    {
      name: "Kashmir Corporate Retreat",
      duration: "5N / 6D",
      group: "40+ Pax",
      price: 32600,
      type: "Domestic MICE",
      image: img.hero,
      highlights: ["Srinagar", "Gulmarg", "Houseboat Stay"]
    }
  ];

  const destinations = [
    { name: "Bali", type: "Incentive Tours • Luxury Resorts", image: img.hotelLobby },
    { name: "Thailand", type: "Corporate Retreat • Team Building", image: img.hero },
    { name: "Dubai", type: "Dealer Meet • Conferences", image: img.city },
    { name: "Singapore", type: "Leadership Summit • Exhibitions", image: img.expo },
    { name: "Vietnam", type: "Corporate Leisure • Incentives", image: img.city },
    { name: "Maldives", type: "Luxury Executive Retreat", image: img.hotelLobby },
    { name: "Baku", type: "Business + Leisure Experience", image: img.hero },
    { name: "Mauritius", type: "Corporate Incentive Programs", image: img.expo }
  ];

  const services = [
    "International Flights",
    "Luxury Hotels",
    "Conference Hall Setup",
    "Gala Dinner & Awards",
    "Stage Branding",
    "AV & Technical Support",
    "Team Building Activities",
    "Visa Assistance",
    "Airport Transfers",
    "Indian Meals",
    "Tour Managers",
    "Corporate Gifting"
  ];

  return (
    <main className="bg-[#f4f5f7]">
      <section className="mx-auto mt-6 max-w-7xl px-4 lg:px-6">
  <div className="relative overflow-hidden rounded-[32px] shadow-2xl">
    <div className="absolute inset-0 bg-black/55 z-10"></div>

    <SmartImage
      src={img.hero}
      alt="Corporate MICE Solutions"
      className="h-[520px] w-full object-cover"
    />

    <div className="absolute right-6 top-6 z-20 flex flex-col gap-3">
      <div className="rounded-full border border-white/20 bg-[#b51f29]/90 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md shadow-lg">
        Official Travel Partner
      </div>
      <div className="rounded-full border border-white/20 bg-[#b51f29]/90 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md shadow-lg">
        Limited Slots
      </div>
      <div className="rounded-full border border-white/20 bg-[#b51f29]/90 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md shadow-lg">
        Early Bird Offer
      </div>
    </div>

    <div className="absolute inset-x-0 bottom-0 z-20 p-6 lg:p-10">
      <div className="mb-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-[#b51f29]/90 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">Technology</span>
        <span className="rounded-full bg-[#b51f29]/90 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">Innovation</span>
        <span className="rounded-full bg-[#b51f29]/90 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">Manufacturing</span>
        <span className="rounded-full bg-[#b51f29]/90 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">Trade</span>
      </div>

      <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
        Corporate MICE Solutions
      </h1>

      <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/90 lg:text-base">
        <div className="flex items-center gap-2">
          <span className="text-[#ead0d3]">📅</span>
          <span>Custom Dates</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#ead0d3]">📍</span>
          <span>Worldwide Destinations</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#ead0d3]">👥</span>
          <span>Corporate Groups</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#ead0d3]">🌍</span>
          <span>Premium MICE Support</span>
        </div>
      </div>
    </div>
  </div>

  <div className="mt-5 rounded-[26px] border border-[#ead0d3] bg-white p-4 shadow-sm lg:p-5">
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff4f5] text-[#b51f29]">
        ⌁
      </div>
      <h2 className="text-xl font-bold text-slate-950">Exhibition Overview</h2>
    </div>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-[#ead0d3] bg-[#fff4f5] p-4 text-center">
        <p className="text-2xl font-bold text-slate-950">2,800+</p>
        <p className="mt-2 text-sm text-slate-500">Exhibitors</p>
      </div>

      <div className="rounded-2xl border border-[#ead0d3] bg-[#fff4f5] p-4 text-center">
        <p className="text-2xl font-bold text-slate-950">1,50,000+</p>
        <p className="mt-2 text-sm text-slate-500">Visitors</p>
      </div>

      <div className="rounded-2xl border border-[#ead0d3] bg-[#fff4f5] p-4 text-center">
        <p className="text-2xl font-bold text-slate-950">80+</p>
        <p className="mt-2 text-sm text-slate-500">Countries</p>
      </div>

      <div className="rounded-2xl border border-[#ead0d3] bg-[#fff4f5] p-4 text-center">
        <p className="text-2xl font-bold text-slate-950">5 Days</p>
        <p className="mt-2 text-sm text-slate-500">Duration</p>
      </div>
    </div>
  </div>
</section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b51f29]">MICE Categories</p>
            <h2 className="mt-2 text-4xl font-extrabold text-slate-950">Corporate Event Solutions</h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            "Incentive Tours",
            "Dealer Meets",
            "Annual Conferences",
            "Corporate Retreats",
            "Award Nights",
            "Product Launches",
            "Team Building",
            "International Exhibitions"
          ].map((item) => (
            <div key={item} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff4f5] text-2xl">
                ✦
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-slate-950">{item}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Customized corporate planning and execution support.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b51f29]">MICE Packages</p>
            <h2 className="mt-2 text-4xl font-extrabold text-slate-950">Featured Corporate Packages</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">Professionally curated corporate programs customized as per company objectives, delegate count, destination preference and event requirements.</p>
          </div>
          <button className="rounded-2xl border border-[#b51f29] px-5 py-3 text-sm font-bold text-[#b51f29]">Request Custom Package</button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {micePackages.map((item) => (
            <div key={item.name} className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl">
              <div className="relative h-48 overflow-hidden">
                <SmartImage src={item.image} alt={item.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#b51f29] shadow-lg">{item.type}</span>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-extrabold leading-tight">{item.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-white/75">{item.duration} • {item.group}</p>
                </div>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="font-bold uppercase text-slate-400">Duration</p>
                    <p className="mt-1 font-extrabold text-slate-950">{item.duration}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="font-bold uppercase text-slate-400">Group Size</p>
                    <p className="mt-1 font-extrabold text-slate-950">{item.group}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.highlights.map((highlight) => (
                    <span key={highlight} className="rounded-full bg-[#fff4f5] px-3 py-1 text-[10px] font-bold text-[#b51f29]">
                      {highlight}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-end justify-between border-t pt-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Starting From</p>
                    <p className="text-xl font-extrabold text-[#b51f29]">{inr(item.price)}</p>
                  </div>
                  <button className="rounded-xl bg-[#b51f29] px-4 py-3 text-xs font-bold text-white">View Plan</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b51f29]">Popular Destinations</p>
          <h2 className="mt-2 text-4xl font-extrabold text-slate-950">International MICE Destinations</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {destinations.map((item) => (
            <div key={item.name} className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl">
              <div className="relative h-56 overflow-hidden">
                <SmartImage src={item.image} alt={item.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-extrabold">{item.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-white/75">{item.type}</p>
                </div>
              </div>
              <div className="p-5">
                <button className="w-full rounded-2xl bg-[#b51f29] py-3 text-sm font-bold text-white">
                  Explore Program
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="overflow-hidden rounded-[36px] bg-[#3f0b10] text-white">
          <div className="grid items-center gap-10 px-8 py-10 lg:grid-cols-[1fr_420px] lg:px-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Services Included</p>
              <h2 className="mt-3 text-4xl font-extrabold leading-tight">Complete Corporate Event Management</h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {services.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-sm font-bold backdrop-blur-md">
                    ✓ {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] bg-white p-5 text-slate-900 shadow-2xl">
              <h3 className="text-2xl font-extrabold">Get Custom Proposal</h3>
              <div className="mt-5 grid gap-3">
                <input placeholder="Company Name" className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-[#b51f29]" />
                <input placeholder="Contact Person" className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-[#b51f29]" />
                <input placeholder="Destination Preference" className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-[#b51f29]" />
                <input placeholder="Approx Group Size" className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-[#b51f29]" />
                <textarea rows={4} placeholder="Event Requirement" className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-[#b51f29]" />
              </div>

              <button className="mt-5 w-full rounded-2xl bg-[#b51f29] py-4 text-sm font-bold text-white">
                Submit Requirement
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function HomePage(props) {
  return (
    <>
      <section className="relative overflow-hidden bg-[#3f0b10]">
        <SmartImage src={img.hero} alt="Trade fair delegation" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3f0b10] via-[#3f0b10]/92 to-[#3f0b10]/30" />

        <div className="relative mx-auto max-w-7xl px-6 py-10 md:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_.85fr]">
            <div className="max-w-3xl text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] backdrop-blur-md">
                International Trade Fair Packages
              </div>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-5xl">
                Book Business Delegation Packages Online
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
                Flights, hotels, visa support, Indian meals, transfers and tour manager support — managed professionally by RC Trips.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={() => props.setPage("listing")} className="rounded-xl bg-[#b51f29] px-6 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-[#8f1820]">
                  Explore Trade Fairs
                </button>

                <button type="button" className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white hover:text-slate-900">
                  WhatsApp Us
                </button>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[["150+", "Trade Fairs"], ["24/7", "Support"], ["Since 2007", "Trusted Partner"]].map((item) => (
                  <div key={item[0]} className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md">
                    <h3 className="text-xl font-extrabold text-white">{item[0]}</h3>
                    <p className="mt-1 text-xs text-white/65">{item[1]}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
                <div className="grid gap-4 md:grid-cols-[1fr_.9fr] lg:grid-cols-1 xl:grid-cols-[1fr_.9fr]">
                  <SmartImage src={img.cphiBanner} alt="Trade fair" className="h-48 w-full rounded-[22px] object-cover" />

                  <div className="rounded-[22px] bg-white p-4 text-slate-900">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#b51f29]">Featured Package</p>
                        <h3 className="mt-1 text-xl font-extrabold leading-tight">CPHI China 2026</h3>
                      </div>
                      <span className="rounded-full bg-[#fff4f5] px-2.5 py-1 text-[10px] font-bold text-[#b51f29]">Best Seller</span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-slate-50 p-2">
                        <p className="text-[9px] font-bold uppercase text-slate-400">Dates</p>
                        <p className="mt-1 text-xs font-bold">16–18 Jun</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-2">
                        <p className="text-[9px] font-bold uppercase text-slate-400">Venue</p>
                        <p className="mt-1 text-xs font-bold">SNIEC</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-2">
                        <p className="text-[9px] font-bold uppercase text-slate-400">Start</p>
                        <p className="mt-1 text-xs font-bold text-[#b51f29]">₹63,500</p>
                      </div>
                    </div>

                    <button type="button" onClick={() => props.setPage("package")} className="mt-4 w-full rounded-xl bg-[#b51f29] py-3 text-sm font-bold text-white transition hover:bg-[#8f1820]">
                      View Package Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <section className="grid gap-5 md:grid-cols-4">
          {[
            ["✈", "Flights + Hotels", "Professionally managed travel packages"],
            ["🛂", "Visa Assistance", "Complete visa documentation support"],
            ["🍽", "Indian Meals", "Comfort food during your journey"],
            ["👨‍💼", "Tour Manager", "Dedicated on-ground assistance"]
          ].map((item) => (
            <div key={item[1]} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff4f5] text-2xl">{item[0]}</div>
              <h3 className="mt-5 text-lg font-extrabold text-slate-950">{item[1]}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item[2]}</p>
            </div>
          ))}
        </section>

        <section className="mt-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b51f29]">Popular Trade Fairs</p>
              <h2 className="mt-2 text-4xl font-extrabold text-slate-950">Featured International Exhibitions</h2>
            </div>

            <button
              type="button"
              onClick={() => props.setPage("listing")}
              className="rounded-2xl border border-[#b51f29] px-5 py-3 text-sm font-bold text-[#b51f29] transition hover:bg-[#b51f29] hover:text-white"
            >
              View All Packages
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {fairs.slice(0, 3).map((fair) => (
              <div key={fair.name} className="group overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl">
                <div className="relative h-56 overflow-hidden">
                  <SmartImage src={fair.tag === "Pharma" ? img.cphiBanner : img.city} alt={fair.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#b51f29] shadow-lg">{fair.tag}</span>
                </div>

                <div className="p-5">
                  <h3 className="min-h-[60px] text-xl font-extrabold leading-tight text-slate-950">{fair.name}</h3>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>📅 {fair.date}</p>
                    <p>📍 {fair.city}</p>
                  </div>

                  <div className="mt-5 flex items-end justify-between border-t pt-4">
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400">Starting From</p>
                      <p className="mt-1 text-2xl font-extrabold text-[#b51f29]">{inr(fair.price, "Coming Soon")}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => props.setPage("package")}
                      className="rounded-2xl bg-[#b51f29] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#8f1820]"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 overflow-hidden rounded-[36px] bg-[#3f0b10] text-white">
          <div className="grid items-center gap-10 px-8 py-10 lg:grid-cols-[1fr_420px] lg:px-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Why Businesses Choose Us</p>
              <h2 className="mt-3 text-4xl font-extrabold leading-tight">Complete Business Travel Experience</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/75">
                RC Trips manages everything from flights and hotels to visa assistance, Indian meals, airport transfers and fairground logistics.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {["Hotels Near Fairground", "Group Airport Transfers", "Visa Assistance", "Indian Dinner", "Travel Insurance", "Luxury Vehicles"].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-sm font-bold backdrop-blur-md">✓ {item}</div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[30px] bg-white p-5 text-slate-900 shadow-2xl">
              <SmartImage src={img.hotelLobby} alt="Luxury stay" className="h-56 w-full rounded-[24px] object-cover" />
              <div className="mt-5">
                <h3 className="text-2xl font-extrabold">Premium Delegate Experience</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">Experience luxury hotels, professional management and seamless travel coordination during your international business journey.</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-4 text-center"><p className="text-2xl font-extrabold text-[#b51f29]">8000+</p><p className="mt-1 text-xs font-semibold text-slate-500">Delegates</p></div>
                  <div className="rounded-2xl bg-slate-50 p-4 text-center"><p className="text-2xl font-extrabold text-[#b51f29]">40+</p><p className="mt-1 text-xs font-semibold text-slate-500">Countries</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b51f29]">How It Works</p>
            <h2 className="mt-2 text-4xl font-extrabold text-slate-950">Book Your Trade Fair Tour in 4 Simple Steps</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">A guided online flow designed for business travellers, delegates and corporate teams.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            {[["01", "Choose Package", "Select city-wise or land-only package."], ["02", "Select Flight & Hotel", "Compare available flights, hotel and sharing type."], ["03", "Submit Traveller Details", "Add company and traveller details securely."], ["04", "Pay & Confirm", "Choose partial or full payment and confirm booking."]].map((step) => (
              <div key={step[0]} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff4f5] text-lg font-extrabold text-[#b51f29]">{step[0]}</div>
                <h3 className="mt-5 text-lg font-extrabold text-slate-950">{step[1]}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step[2]}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div className="rounded-[34px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b51f29]">Industries We Serve</p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight text-slate-950">Trade Fair Travel for Every Major Industry</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">From pharma and machinery to automotive, metals, packaging and multi-sector exhibitions, RC Trips helps Indian business visitors travel with complete arrangements.</p>
            <button type="button" onClick={() => props.setPage("listing")} className="mt-7 rounded-2xl bg-[#b51f29] px-6 py-3 text-sm font-bold text-white">Explore Industries</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["Pharma & Healthcare", "Metals & Aluminium", "Automotive", "Packaging", "Rubber & Plastics", "Multi-Sector Trade"].map((industry) => (
              <div key={industry} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <p className="text-sm font-extrabold text-slate-950">{industry}</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">Delegation packages with flights, hotels, visa support and transfers.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[420px_1fr]">
            <SmartImage src={img.expo} alt="Business meeting" className="h-full min-h-[360px] w-full object-cover" />
            <div className="p-8 lg:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b51f29]">For Corporate Teams</p>
              <h2 className="mt-3 text-4xl font-extrabold text-slate-950">Group Delegation Support</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">Perfect for associations, business groups and companies sending multiple delegates. Our team can manage group travel, documentation, coordination and on-ground support.</p>
              <div className="mt-7 grid gap-3 md:grid-cols-2">
                {["Custom group itinerary", "Dedicated tour manager", "Bulk traveller details", "Association delegation support", "Hotel near fairground", "Indian meal coordination"].map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-bold text-slate-800">✓ {item}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b51f29]">Frequently Asked Questions</p>
            <h2 className="mt-2 text-4xl font-extrabold text-slate-950">Before You Book</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[["Can I book without flight?", "Yes, land-only packages are available where you can arrange your own flight."], ["Can I choose single sharing?", "Yes, hotel section allows twin and single sharing selection with price update."], ["Do you assist with visa?", "Yes, visa documentation assistance is included as per package terms."], ["Can I pay 50% now?", "Yes, users can choose partial payment or full payment during checkout."]].map((faq) => (
              <div key={faq[0]} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-extrabold text-slate-950">{faq[0]}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq[1]}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 overflow-hidden rounded-[36px] bg-gradient-to-r from-[#b51f29] to-[#3f0b10] p-8 text-white md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Start Planning</p>
              <h2 className="mt-2 text-3xl font-extrabold">Need help choosing the right trade fair package?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">Speak with our travel expert and get the right package suggestion based on your city, budget and business requirement.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => props.setPage("listing")} className="rounded-2xl bg-white px-6 py-4 text-sm font-bold text-[#b51f29]">View Packages</button>
              <button type="button" className="rounded-2xl border border-white/30 px-6 py-4 text-sm font-bold text-white">Call +91-7290012474</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function ListingPage(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All"].concat(Array.from(new Set(fairs.map((fair) => fair.tag))));
  const filteredFairs = fairs.filter((fair) => {
    const keyword = searchTerm.toLowerCase().trim();
    const matchesSearch = !keyword || fair.name.toLowerCase().includes(keyword) || fair.city.toLowerCase().includes(keyword) || fair.tag.toLowerCase().includes(keyword) || fair.date.toLowerCase().includes(keyword);
    const matchesCategory = selectedCategory === "All" || fair.tag === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <section className="mb-8 overflow-hidden rounded-[32px] bg-[#3f0b10] text-white shadow-xl">
        <div className="grid gap-6 p-6 md:grid-cols-[1fr_420px] md:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Search Trade Fair</p>
            <h1 className="mt-2 text-4xl font-extrabold">Find Your Trade Fair Package</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">Search by exhibition name, industry, city, country or date to quickly find the right package.</p>
          </div>
          <div className="rounded-3xl bg-white p-4 text-slate-900 shadow-2xl">
            <div className="relative">
              <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search CPHI, Aluminium, Canton Fair..." className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 pr-12 text-sm font-semibold outline-none focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-[#b51f29]">⌕</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button key={category} type="button" onClick={() => setSelectedCategory(category)} className={cls("rounded-full px-3 py-2 text-xs font-bold transition", selectedCategory === category ? "bg-[#b51f29] text-white" : "bg-slate-100 text-slate-600 hover:bg-[#fff4f5] hover:text-[#b51f29]")}>{category}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950">Trade Fair Packages</h2>
          <p className="mt-1 text-sm text-slate-500">Showing {filteredFairs.length} package{filteredFairs.length === 1 ? "" : "s"}</p>
        </div>
        {(searchTerm || selectedCategory !== "All") ? <button type="button" onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }} className="rounded-xl border border-[#b51f29] px-4 py-2 text-sm font-bold text-[#b51f29]">Clear Search</button> : null}
      </div>

      {filteredFairs.length === 0 ? <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200"><h3 className="text-2xl font-extrabold text-slate-950">No trade fair found</h3><p className="mt-2 text-sm text-slate-500">Try searching with another exhibition name, city or industry.</p></div> : null}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredFairs.map((fair) => (
          <div key={fair.name} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="h-36 bg-slate-100"><SmartImage src={fair.tag === "Pharma" ? img.expo : img.city} alt={fair.name} className="h-full w-full object-cover" /></div>
            <div className="p-5">
              <span className="rounded-full bg-[#fff4f5] px-3 py-1 text-xs font-bold text-[#b51f29]">{fair.tag}</span>
              <h3 className="mt-4 min-h-12 font-bold text-slate-900">{fair.name}</h3>
              <p className="mt-2 text-sm text-slate-600">▣ {fair.date}</p>
              <p className="mt-1 text-sm text-slate-600">⌖ {fair.city}</p>
              <div className="mt-5"><b className="text-xl text-[#b51f29]">{inr(fair.price, "Coming Soon")}</b></div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => props.setPage("package")} className="rounded-xl bg-[#b51f29] px-4 py-3 text-sm font-bold text-white">Read More</button>
                <button type="button" onClick={() => props.setPage("package")} className="rounded-xl border border-[#b51f29] px-4 py-3 text-sm font-bold text-[#b51f29]">Book Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function StepHeader(props) {
  const items = ["Package Details", "Company Details", "Traveller Details", "Checkout"];
  return (
    <div className="bg-[#b51f29] text-white">
      <div className="mx-auto grid max-w-7xl gap-3 px-6 py-5 md:grid-cols-4">
        {items.map((label, index) => {
          const num = index + 1;
          const active = props.step === num;
          const done = props.step > num;
          return (
            <div key={label} className="flex items-center gap-3">
              <div className={cls("flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold", active ? "border-white bg-white text-[#b51f29]" : done ? "border-green-300 bg-green-600 text-white" : "border-white/50 bg-transparent text-white")}>{done ? "✓" : num}</div>
              <div><p className="text-xs font-bold">{label}</p><p className="text-[10px] uppercase tracking-wide text-white/65">{index === 0 ? "Select flight, hotel & package" : index === 1 ? "Enter company information" : index === 2 ? "Add traveller information" : "Review & confirm booking"}</p></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TradeFairIntro(props) {
  const pkg = props.pkg;
  const title = "CPHI China & PMEC China 2026";
  const overviewStats = [
    { value: "3 Days", label: "Global Pharma Exhibition" },
    { value: "3,500+", label: "International Exhibitors" },
    { value: "90K+", label: "Trade Visitors" },
    { value: "150+", label: "Countries Represented" }
  ];
  const eventDetails = [
    { icon: Building2, title: "Event Name", text: "CPHI China 2026" },
    { icon: CalendarDays, title: "Exhibition Dates", text: "16-18 June 2026" },
    { icon: Clock3, title: "Days & Timing", text: "Tuesday - Thursday\n9:00 AM - 6:00 PM (CST)" },
    { icon: MapPin, title: "Venue", text: "Shanghai New International\nExpo Centre (SNIEC)" },
    { icon: Globe2, title: "Location", text: "Shanghai, China" }
  ];
  const focusAreas = [
    { icon: Pill, title: "Active Pharmaceutical Ingredients", text: "APIs, intermediates, fine chemicals, pharmaceutical raw materials and bulk drugs." },
    { icon: HeartPulse, title: "Finished Dosage Formulations", text: "Tablets, capsules, injectables, biologics and finished pharmaceutical products." },
    { icon: Cpu, title: "Pharma Machinery & Technology", text: "Manufacturing equipment, automation systems, laboratory technology and cleanroom solutions." },
    { icon: Package, title: "Packaging & Drug Delivery", text: "Pharmaceutical packaging, blister systems, labeling and advanced drug delivery technologies." },
    { icon: ShieldCheck, title: "Biopharma & Compliance", text: "Biotechnology, regulatory services, quality assurance and compliance solutions." },
    { icon: Lightbulb, title: "Innovation & R&D", text: "Drug discovery, AI in pharmaceuticals, contract research and healthcare innovation." }
  ];

  return (
    <div className="mb-8 space-y-8">
        <div className="relative overflow-hidden rounded-[34px] shadow-2xl">
          <SmartImage src={img.expo} alt={title} className="h-[520px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20" />
          <div className="absolute right-6 top-6 z-20 hidden flex-col gap-3 sm:flex">
            {["Official Travel Partner", "Limited Slots", "Early Bird Offer"].map((badge) => (
              <div key={badge} className="rounded-full border border-white/20 bg-[#b51f29]/90 px-5 py-3 text-sm font-bold text-white shadow-lg backdrop-blur-md">
                {badge}
              </div>
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-10">
            <div className="mb-5 flex flex-wrap gap-2">
              {["Pharma", "Innovation", "Manufacturing", "Trade"].map((tag) => (
                <span key={tag} className="rounded-full bg-[#b51f29]/95 px-4 py-2 text-xs font-bold text-white shadow-md backdrop-blur-md">{tag}</span>
              ))}
            </div>

            <h1 className="max-w-full text-3xl font-bold leading-tight tracking-tight text-white md:whitespace-nowrap md:text-[42px] xl:text-[46px]">
              {title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-semibold text-white/90 md:text-base">
              <div>📅 16–18 June 2026</div>
              <div>📍 Shanghai New International Expo Centre (SNIEC)</div>
              <div>👥 2,800+ Exhibitors</div>
              <div>🌍 150,000+ Visitors</div>
            </div>
          </div>
        </div>

        {false ? (
        <div className="mt-8 rounded-[32px] border border-[#ead0d3] bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff4f5] text-base text-[#b51f29]">◇</div>
            <h2 className="text-2xl font-bold text-slate-950">Exhibition Overview</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {["2,800+|Exhibitors", "1,50,000+|Visitors", "80+|Countries", "3 Days|Duration"].map((item) => {
              const parts = item.split("|");
              return (
                <div key={item} className="rounded-2xl border border-[#ead0d3] bg-[#fff4f5] p-4 text-center">
                  <p className="text-2xl font-bold text-slate-950">{parts[0]}</p>
                  <p className="mt-2 text-sm text-slate-500">{parts[1]}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Exhibition Focus Areas</p>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { title: "Active Pharmaceutical Ingredients", items: ["API suppliers", "drug ingredients", "bulk drug solutions"] },
                { title: "Pharma Machinery", items: ["tablet presses", "capsule filling", "processing equipment"] },
                { title: "Packaging Solutions", items: ["blister packaging", "bottling systems", "labelling technologies"] }
              ].map((focus) => (
                <div key={focus.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-bold text-slate-950">{focus.title}</h3>
                  <ul className="mt-2 space-y-1.5 text-sm leading-5 text-slate-600">
                    {focus.items.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b51f29]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        ) : (
          <ExhibitionOverviewSection overviewStats={overviewStats} eventDetails={eventDetails} focusAreas={focusAreas} />
        )}
    </div>
  );
}

function ExhibitionOverviewSection(props) {
  return (
    <div className="overflow-hidden rounded-[30px] bg-white shadow-sm ring-1 ring-slate-200">
      <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#b51f29] via-[#5d1117] to-[#111827] px-6 py-7 text-white">
        <div className="absolute -right-14 -top-20 h-64 w-64 rounded-full border-[72px] border-white/10" />
        <div className="absolute -right-10 top-8 h-36 w-36 rounded-full bg-white/10" />
        <div className="relative">
          <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold text-[#b51f29] shadow-sm">
            Asia's Leading Pharmaceutical Ingredients & Pharma Technology Exhibition
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">CPHI China 2026</h2>
          <p className="mt-3 text-sm font-bold leading-6 text-white">
            CPHI China 2026 will be held from 16-18 June 2026 at the Shanghai New International Expo Centre (SNIEC), Shanghai, China.
          </p>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-white/90">
            One of Asia's largest pharmaceutical trade fairs, connecting API manufacturers, pharma companies, biotech innovators, contract manufacturers, packaging suppliers and healthcare professionals.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {props.overviewStats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/20 bg-white/12 px-4 py-3 text-center shadow-sm backdrop-blur">
                <p className="text-2xl font-extrabold leading-none text-white">{stat.value}</p>
                <p className="mt-2 text-[11px] font-bold text-white/90">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid items-stretch gap-5 p-5 lg:grid-cols-[260px_1fr]">
        <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <CalendarDays className="h-6 w-6 text-[#b51f29]" />
            <h3 className="text-xl font-extrabold uppercase text-[#b51f29]">Event Details</h3>
          </div>
          <div className="flex flex-1 flex-col justify-between gap-3">
            {props.eventDetails.map((detail) => {
              const Icon = detail.icon;
              return (
                <div key={detail.title} className="flex flex-1 items-center gap-3 rounded-xl border-l-4 border-[#b51f29] bg-slate-50 p-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#b51f29] text-white">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-[13px] font-extrabold text-slate-950">{detail.title}</p>
                    <p className="mt-0.5 whitespace-pre-line text-[12px] leading-5 text-slate-700">{detail.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Target className="h-6 w-6 text-[#b51f29]" />
            <h3 className="text-xl font-extrabold uppercase text-[#b51f29]">Exhibition Focus</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {props.focusAreas.map((focus) => {
              const Icon = focus.icon;
              return (
                <div key={focus.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#b51f29] text-white shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold leading-5 text-slate-950">{focus.title}</h4>
                      <p className="mt-2 text-xs leading-5 text-slate-700">{focus.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function PackageCard(props) {
  const option = props.option;
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={cls(
        "relative overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg",
        props.selected ? "border-[#b51f29] bg-[#fff4f5] shadow-xl ring-4 ring-[#b51f29]/15" : "border-slate-200 hover:border-[#b51f29]/40"
      )}
    >
      {props.selected ? <div className="absolute inset-x-0 top-0 z-20 h-1.5 bg-[#b51f29]" /> : null}
      <div className="relative h-32 overflow-hidden">
        <SmartImage src={option.image || img.city} alt={option.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[10px] font-bold text-[#b51f29] shadow">{option.badge}</div>
        <div className={cls("absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border-2 bg-white shadow-lg", props.selected ? "border-[#b51f29]" : "border-white/80")}>
          <span className={cls("flex h-5 w-5 items-center justify-center rounded-full border", props.selected ? "border-[#b51f29] bg-[#b51f29]" : "border-slate-400 bg-white")}>
            {props.selected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">{option.city}</div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="min-h-10 text-[15px] font-extrabold leading-5 text-slate-950">{option.title}</h3>
            <p className="mt-2 inline-flex rounded-full border border-[#ead0d3] bg-[#fff4f5] px-2.5 py-1 text-[12px] font-extrabold text-[#b51f29]">{option.date}</p>
          </div>
          {props.selected ? <span className="rounded-full bg-[#b51f29] px-3 py-1 text-[10px] font-bold text-white">Selected</span> : null}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-extrabold text-slate-700">
          <span className="rounded-full border border-[#ead0d3] bg-white px-2.5 py-1.5 shadow-sm">{option.packageType === "land" ? "WITHOUT FLIGHTS" : "FLIGHT"}</span>
          <span className="rounded-full border border-[#ead0d3] bg-white px-2.5 py-1.5 shadow-sm">HOTEL</span>
          <span className="rounded-full border border-[#ead0d3] bg-white px-2.5 py-1.5 shadow-sm">ITINERARY</span>
        </div>
        <div className="mt-4 flex items-end justify-between border-t pt-3">
          <div>
            <p className="text-xl font-extrabold text-[#b51f29]">{inr(option.price)}</p>
            <p className="text-[10px] text-slate-500">PER PERSON</p>
          </div>
          <span className={cls("rounded-xl px-3 py-2 text-xs font-bold", props.selected ? "bg-[#b51f29] text-white" : "bg-[#fff4f5] text-[#b51f29]")}>{props.selected ? "Selected" : "Select"}</span>
        </div>
      </div>
    </button>
  );
}
function airportName(code) {
  const airports = {
    DEL: "Delhi",
    BOM: "Mumbai",
    HYD: "Hyderabad",
    BLR: "Bangalore",
    AMD: "Ahmedabad",
    MAA: "Chennai",
    PVG: "Shanghai",
    HKG: "Hong Kong",
    SIN: "Singapore",
    BKK: "Bangkok"
  };
  return airports[code] || code;
}

function formatFlightText(text) {
  return text.replace(/(DEL|BOM|HYD|PVG|HKG|SIN|BKK)/g, function(code) {
    return airportName(code) + " (" + code + ")";
  });
}

function routeWithCityNames(route) {
  return route.split(" - ").map(function(code) {
    return airportName(code) + " (" + code + ")";
  }).join(" → ");
}

function parseFlightSegment(text) {
  const parts = text.split(" ");
  const date = parts[0] + " " + parts[1].replace(",", "");
  const fromTime = parts[2] || "";
  const fromCode = parts[3] || "";
  const toTime = parts[5] || "";
  const toCode = parts[6] || "";
  return { date, fromTime, fromCode, toTime, toCode };
}

function FlightTimelineRow(props) {
  const segment = props.segment;
  return (
    <div className="grid grid-cols-[78px_1fr_78px] items-center gap-2 py-2.5">
      <div>
        <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{props.label}</p>
        <p className="mt-0.5 text-xl font-extrabold leading-none text-slate-950">{segment.fromTime || "--:--"}</p>
        <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-500">{airportName(segment.fromCode)} ({segment.fromCode})</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-px flex-1 border-t border-dashed border-slate-300" />
        <div className="rounded-lg bg-white px-2 py-1.5 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-[11px] font-extrabold leading-none text-[#b51f29]">{props.logo}</p>
          <p className="mt-0.5 text-[8px] font-bold tracking-wide text-slate-400">AIRLINE</p>
        </div>
        <div className="h-px flex-1 border-t border-dashed border-slate-300" />
      </div>

      <div className="text-right">
        <p className="text-[9px] font-bold text-slate-400">{segment.date}</p>
        <p className="mt-0.5 text-xl font-extrabold leading-none text-slate-950">{segment.toTime || "--:--"}</p>
        <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-500">{airportName(segment.toCode)} ({segment.toCode})</p>
      </div>
    </div>
  );
}

function FlightOption(props) {
  const flight = props.flight;
  const isOwnFlight = flight.id === "own-flight";
  const outbound = parseFlightSegment(flight.outbound);
  const inbound = parseFlightSegment(flight.inbound);

  if (isOwnFlight) {
    return (
      <button type="button" onClick={props.onClick} className={cls("w-full overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:border-[#b51f29]", props.selected ? "border-[#b51f29] ring-2 ring-[#b51f29]/10" : "border-slate-200")}>
        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={cls("flex h-5 w-5 items-center justify-center rounded-full border", props.selected ? "border-[#b51f29] bg-[#b51f29]" : "border-slate-400 bg-white")}>
                {props.selected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
              </span>
              <div>
                <p className="text-lg font-bold text-slate-900">Own Flight Arrangement</p>
                <p className="mt-1 text-sm text-slate-500">You will arrange your own flight tickets.</p>
              </div>
            </div>
            {props.selected ? <span className="rounded-full bg-[#b51f29] px-3 py-1 text-xs font-bold text-white">Selected</span> : null}
          </div>
          <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">Share arrival and departure timing with RC Trips team for smooth transfer coordination.</p>
        </div>
      </button>
    );
  }

  return (
    <button type="button" onClick={props.onClick} className={cls("w-full overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:border-[#b51f29]", props.selected ? "border-[#b51f29] ring-2 ring-[#b51f29]/10" : "border-slate-200")}>
      <div className="border-b bg-slate-50 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={cls("flex h-5 w-5 items-center justify-center rounded-full border", props.selected ? "border-[#b51f29] bg-[#b51f29]" : "border-slate-400 bg-white")}>
              {props.selected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
            </span>
            <div>
              <p className="text-base font-bold leading-none text-slate-950">{flight.airline}</p>
              <p className="mt-1 text-[11px] font-medium text-slate-500">{flight.flightNo} • {flight.baggage}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={cls("text-sm font-bold", flight.price ? "text-[#b51f29]" : "text-green-700")}>{flight.price ? "+ " + inr(flight.price) : "Included"}</p>
            {props.selected ? <p className="mt-1 text-xs font-bold text-[#b51f29]">Selected</p> : null}
          </div>
        </div>
      </div>

      <div className="px-4 py-1">
        <FlightTimelineRow label="Departure" segment={outbound} logo={flight.logo} />
        <div className="border-t border-slate-100" />
        <FlightTimelineRow label="Return" segment={inbound} logo={flight.logo} />
      </div>
    </button>
  );
}

function HotelOption(props) {
  const hotel = props.hotel;
  const selectedOccupancy = props.selectedOccupancy || "twin";

  function selectHotel() {
    props.onClick();
  }

  function selectOccupancy(event, type) {
    event.stopPropagation();
    props.onSelectHotelOnly();
    props.onOccupancyChange(type);
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={selectHotel}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectHotel();
        }
      }}
      className={cls(
        "group flex h-full cursor-pointer flex-col overflow-hidden rounded-[28px] bg-white shadow-sm transition-all duration-300",
        props.selected
          ? "border-2 border-[#b51f29] bg-[#fff4f5] shadow-2xl ring-4 ring-[#b51f29]/10"
          : "border border-slate-200 hover:-translate-y-1 hover:border-[#b51f29]/50 hover:shadow-xl"
      )}
    >
      <div className="relative h-40 shrink-0 overflow-hidden">
        <SmartImage src={hotel.image} alt={hotel.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        <button
          type="button"
          aria-label={props.selected ? "Selected hotel" : "Select hotel"}
          onClick={(event) => {
            event.stopPropagation();
            selectHotel();
          }}
          className={cls(
            "absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 bg-white/95 shadow-lg transition hover:scale-105",
            props.selected ? "border-[#b51f29] ring-4 ring-white/35" : "border-white/90 hover:border-[#b51f29]"
          )}
        >
          <span className={cls("flex h-5 w-5 items-center justify-center rounded-full border", props.selected ? "border-[#b51f29] bg-[#b51f29]" : "border-slate-400 bg-white")}>
            {props.selected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
          </span>
        </button>

        <div className="absolute bottom-3 left-3 flex gap-1 text-xs text-yellow-400 drop-shadow-lg">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>

        {props.selected ? (
          <div className="absolute right-3 top-3 rounded-full bg-[#b51f29] px-3 py-1.5 text-[11px] font-bold text-white shadow-lg">
            ✓ Selected
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="min-h-[104px]">
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-950">{hotel.name}</h3>
          <p className="mt-1.5 line-clamp-1 text-xs text-slate-500">⌖ {hotel.location}</p>
          <p className="mt-1 text-xs font-medium text-slate-500">Standard</p>
          <div className="mt-3 inline-flex rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-bold text-green-700">
            Breakfast Included
          </div>
        </div>

        <div className="mt-3 min-h-[92px] space-y-2 text-xs leading-5 text-slate-600">
          <p className="line-clamp-2"><span className="font-bold text-slate-800">Rooms:</span> {hotel.rooms}</p>
          <p className="line-clamp-2"><span className="font-bold text-slate-800">Facilities:</span> {hotel.facilities}</p>
        </div>

        <div className="mt-auto border-t border-slate-100 pt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-bold text-green-700">
              {hotel.twin ? "Upgrade available" : "Included in package"}
            </p>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                selectHotel();
              }}
              className={cls(
                "rounded-full px-4 py-2 text-xs font-bold transition",
                props.selected
                  ? "bg-[#b51f29] text-white shadow-md"
                  : "border border-[#b51f29] bg-white text-[#b51f29] hover:bg-[#b51f29] hover:text-white"
              )}
            >
              {props.selected ? "Selected" : "Select Hotel"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={(event) => selectOccupancy(event, "twin")}
              className={cls(
                "min-h-[46px] rounded-2xl px-3 py-2 text-xs font-bold leading-tight transition",
                props.selected && selectedOccupancy === "twin"
                  ? "bg-[#b51f29] text-white shadow-md ring-2 ring-[#b51f29]/25"
                  : "bg-[#fff4f5] text-slate-700 hover:bg-[#fff4f5] hover:text-[#b51f29]"
              )}
            >
              <span className="block">Twin Sharing</span>
              <span className={cls("mt-0.5 block text-[11px]", props.selected && selectedOccupancy === "twin" ? "text-white/85" : "text-slate-500")}>{hotel.twin ? inr(hotel.twin) + " Extra" : "Base Price"}</span>
            </button>

            <button
              type="button"
              onClick={(event) => selectOccupancy(event, "single")}
              className={cls(
                "min-h-[46px] rounded-2xl px-3 py-2 text-xs font-bold leading-tight transition",
                props.selected && selectedOccupancy === "single"
                  ? "bg-[#b51f29] text-white shadow-md ring-2 ring-[#b51f29]/25"
                  : "bg-[#fff4f5] text-slate-700 hover:bg-[#fff4f5] hover:text-[#b51f29]"
              )}
            >
              <span className="block">Single Sharing</span>
              <span className={cls("mt-0.5 block text-[11px]", props.selected && selectedOccupancy === "single" ? "text-white/85" : "text-slate-500")}>{inr(hotel.single)} Extra</span>
            </button>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              props.onViewDetails(hotel);
            }}
            className="mt-3 w-full rounded-xl border border-[#b51f29] bg-white px-4 py-2.5 text-xs font-bold text-[#b51f29] transition hover:bg-[#fff4f5]"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}

function HotelDetailsModal(props) {
  const hotel = props.hotel;
  const [photoIndex, setPhotoIndex] = useState(0);
  if (!hotel) return null;

  const gallery = hotel.gallery || [hotel.image];
  const activePhoto = gallery[photoIndex] || hotel.image;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md">
      <div className="relative grid max-h-[88vh] w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-2xl lg:grid-cols-[1.05fr_.95fr]">
        <button
          type="button"
          onClick={props.onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-xl font-bold text-slate-700 shadow-lg transition hover:bg-[#b51f29] hover:text-white"
        >
          ×
        </button>

        <div className="bg-slate-950 p-3">
          <div className="relative h-[390px] overflow-hidden rounded-3xl lg:h-full">
            <SmartImage src={activePhoto} alt={hotel.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

            <button
              type="button"
              onClick={() => setPhotoIndex((photoIndex - 1 + gallery.length) % gallery.length)}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-2xl font-bold text-slate-800 shadow"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setPhotoIndex((photoIndex + 1) % gallery.length)}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-2xl font-bold text-slate-800 shadow"
            >
              ›
            </button>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="rounded-2xl bg-black/45 p-4 text-white backdrop-blur-md">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">Hotel Gallery</p>
                <h2 className="mt-1 text-xl font-extrabold leading-tight">{hotel.name}</h2>
                <p className="mt-2 text-xs text-white/75">{photoIndex + 1} of {gallery.length} photos</p>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {gallery.map((photo, index) => (
              <button
                type="button"
                key={photo + index}
                onClick={() => setPhotoIndex(index)}
                className={cls("overflow-hidden rounded-xl border-2", index === photoIndex ? "border-white" : "border-transparent opacity-70")}
              >
                <SmartImage src={photo} alt="Hotel thumbnail" className="h-16 w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[88vh] overflow-y-auto p-5 md:p-6">
          <div className="pr-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b51f29]">Hotel Details</p>
            <h3 className="mt-2 text-2xl font-extrabold leading-tight text-slate-950">{hotel.name}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#fff4f5] px-3 py-1 text-xs font-bold text-[#b51f29]">{hotel.rating}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Shanghai, China</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-[11px] font-bold uppercase text-slate-400">Twin Sharing</p>
              <p className="mt-1 text-lg font-extrabold text-slate-950">{hotel.twin ? inr(hotel.twin) + " Extra" : "Base Price"}</p>
            </div>
            <div className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-[11px] font-bold uppercase text-slate-400">Single Sharing</p>
              <p className="mt-1 text-lg font-extrabold text-[#b51f29]">{inr(hotel.single)} Extra</p>
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-bold uppercase tracking-wide text-[#b51f29]">Location</p>
              <p className="mt-2">{hotel.location}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-bold uppercase tracking-wide text-[#b51f29]">Rooms</p>
              <p className="mt-2">{hotel.rooms}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-bold uppercase tracking-wide text-[#b51f29]">Facilities</p>
              <p className="mt-2">{hotel.facilities}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-bold uppercase tracking-wide text-[#b51f29]">Nearby & Dining</p>
              <p className="mt-2">{hotel.nearby}</p>
              <p className="mt-2">{hotel.dining}</p>
            </div>
          </div>

          <div className="sticky bottom-0 mt-5 bg-white pt-4">
            <button
              type="button"
              onClick={() => {
                props.onSelect(hotel);
                props.onClose();
              }}
              className="w-full rounded-2xl bg-[#b51f29] py-4 text-sm font-bold text-white shadow-lg transition hover:bg-[#8f1820]"
            >
              Continue With This Hotel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TravellerAllocationSection(props) {
  const [selectedTravellers, setSelectedTravellers] = useState([0]);
  const [bulkPkgId, setBulkPkgId] = useState(props.pkg.id);
  const bulkFlights = flightsByPackage[bulkPkgId] || flightsByPackage.land1;
  const [bulkFlightId, setBulkFlightId] = useState(bulkFlights[0].id);
  const [bulkHotelId, setBulkHotelId] = useState(props.hotel.id);
  const flightPackages = packages.filter((item) => item.packageType === "flight");

  useEffect(function() {
    const flights = flightsByPackage[bulkPkgId] || flightsByPackage.land1;
    if (!flights.some((flight) => flight.id === bulkFlightId)) {
      setBulkFlightId(flights[0].id);
    }
  }, [bulkPkgId]);

  function toggleTraveller(index) {
    setSelectedTravellers((current) => {
      if (current.includes(index)) {
        const next = current.filter((item) => item !== index);
        return next.length ? next : [index];
      }
      return current.concat(index).sort((a, b) => a - b);
    });
  }

  function applyBulk() {
    selectedTravellers.forEach((index) => {
      props.updateAllocation(index, { pkgId: bulkPkgId, flightId: bulkFlightId, hotelId: bulkHotelId });
    });
  }

  function rowPrice(allocation) {
    const pkg = packages.find((item) => item.id === allocation.pkgId) || props.pkg;
    const flights = flightsByPackage[pkg.id] || flightsByPackage.land1;
    const flight = flights.find((item) => item.id === allocation.flightId) || flights[0] || props.flight;
    const hotel = hotels.find((item) => item.id === allocation.hotelId) || props.hotel;
    const occupancyCharge = allocation.occupancy === "single" ? hotel.single : hotel.twin;
    return pkg.price + flight.price + occupancyCharge;
  }

  return (
    <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#b51f29]">Optional for group bookings</p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">Traveller Allocation</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">Use this when travellers need different departure cities, flights or hotels.</p>
        </div>
        <div className="inline-flex rounded-2xl bg-slate-100 p-1">
          <button type="button" onClick={() => props.setAllocationMode("same")} className={cls("rounded-xl px-4 py-2 text-xs font-bold transition", props.allocationMode === "same" ? "bg-[#b51f29] text-white shadow-sm" : "text-slate-600 hover:bg-white")}>Same For All</button>
          <button type="button" onClick={() => props.setAllocationMode("different")} className={cls("rounded-xl px-4 py-2 text-xs font-bold transition", props.allocationMode === "different" ? "bg-[#b51f29] text-white shadow-sm" : "text-slate-600 hover:bg-white")}>Different Per Traveller</button>
        </div>
      </div>

      {props.allocationMode === "different" ? (
        <div className="mt-5 space-y-5">
          <div className="rounded-2xl border border-[#ead0d3] bg-[#fff4f5] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#b51f29]">Bulk Apply</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {props.allocations.map((allocation, index) => (
                <button type="button" key={index} onClick={() => toggleTraveller(index)} className={cls("rounded-full border px-3 py-2 text-xs font-bold transition", selectedTravellers.includes(index) ? "border-[#b51f29] bg-[#b51f29] text-white" : "border-slate-200 bg-white text-slate-600")}>Traveller {index + 1}</button>
              ))}
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <label className="block"><span className="mb-1 block text-xs font-bold text-slate-600">Departure City</span><select value={bulkPkgId} onChange={(event) => setBulkPkgId(event.target.value)} className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-[#b51f29]">{flightPackages.map((pkg) => <option key={pkg.id} value={pkg.id}>{pkg.city}</option>)}<option value="land1">Without Flights</option></select></label>
              <label className="block"><span className="mb-1 block text-xs font-bold text-slate-600">Flight</span><select value={bulkFlightId} onChange={(event) => setBulkFlightId(event.target.value)} className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-[#b51f29]">{bulkFlights.map((flight) => <option key={flight.id} value={flight.id}>{flight.airline}</option>)}</select></label>
              <label className="block"><span className="mb-1 block text-xs font-bold text-slate-600">Hotel</span><select value={bulkHotelId} onChange={(event) => setBulkHotelId(event.target.value)} className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-[#b51f29]">{hotels.map((hotel) => <option key={hotel.id} value={hotel.id}>{hotel.id === "howard" ? "Howard Johnson" : "Radisson Blu"}</option>)}</select></label>
              <button type="button" onClick={applyBulk} className="self-end rounded-xl bg-[#b51f29] px-4 py-2.5 text-sm font-bold text-white">Apply</button>
            </div>
          </div>

          <div className="grid gap-3">
            {props.allocations.map((allocation, index) => {
              const pkg = packages.find((item) => item.id === allocation.pkgId) || props.pkg;
              const flights = flightsByPackage[pkg.id] || flightsByPackage.land1;
              const hotel = hotels.find((item) => item.id === allocation.hotelId) || props.hotel;
              return (
                <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="font-bold text-slate-950">Traveller {index + 1}</h3>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#b51f29] shadow-sm">{inr(rowPrice(allocation))}</span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-4">
                    <select value={allocation.pkgId} onChange={(event) => {
                      const nextPkgId = event.target.value;
                      const nextFlights = flightsByPackage[nextPkgId] || flightsByPackage.land1;
                      props.updateAllocation(index, { pkgId: nextPkgId, flightId: nextFlights[0].id });
                    }} className="rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-[#b51f29]">
                      {packages.map((item) => <option key={item.id} value={item.id}>{item.packageType === "land" ? "Without Flights" : item.city}</option>)}
                    </select>
                    <select value={allocation.flightId} onChange={(event) => props.updateAllocation(index, { flightId: event.target.value })} className="rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-[#b51f29]">{flights.map((flight) => <option key={flight.id} value={flight.id}>{flight.airline}</option>)}</select>
                    <select value={allocation.hotelId} onChange={(event) => props.updateAllocation(index, { hotelId: event.target.value })} className="rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-[#b51f29]">{hotels.map((item) => <option key={item.id} value={item.id}>{item.id === "howard" ? "Howard Johnson" : "Radisson Blu"}</option>)}</select>
                    <select value={allocation.occupancy} onChange={(event) => props.updateAllocation(index, { occupancy: event.target.value })} className="rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-[#b51f29]"><option value="twin">Twin Sharing {hotel.twin ? "+ " + inr(hotel.twin) : ""}</option><option value="single">Single Sharing + {inr(hotel.single)}</option></select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function TourIncludes(props) {
  const items = getTourIncludes(props.pkg, props.flight, props.hotel);
  return (
    <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Tour Includes</h2>
          <p className="text-xs text-slate-500">Everything needed for a comfortable journey</p>
        </div>
        <span className="rounded-full bg-[#fff4f5] px-3 py-1 text-xs font-bold text-[#b51f29]">Updates with selection</span>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-bold text-slate-900">{item.title}</p>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Itinerary(props) {
  const flight = props.flight;
  const hotel = props.hotel;
  const days = [
    { day: "Day 1", title: "Arrival in Shanghai", image: img.city, points: [flight.id === "own-flight" ? "Arrive as per own flight schedule." : "Arrival based on selected flight: " + flight.outbound, "Check-in at " + hotel.name, "Welcome dinner with fellow delegates."] },
    { day: "Day 2", title: "Trade Fair Day 01", image: img.expo, points: ["Breakfast at hotel included.", "Transfer to SNIEC exhibition venue.", "Return transfer and Indian dinner."] },
    { day: "Day 3", title: "Business Meetings & Exhibition", image: img.expo, points: ["Full-day exhibition visit.", "Buyer meetings and networking support.", "Indian dinner arranged for group."] },
    { day: "Day 4", title: "Expo + Shanghai Experience", image: img.hotelLobby, points: ["Morning expo visit or B2B meetings.", "Optional city orientation subject to group timing.", "Farewell dinner at Indian restaurant."] },
    { day: "Day 5", title: "Check-out & Return Flight", image: img.flight, points: ["Check-out from " + hotel.name, flight.id === "own-flight" ? "Airport transfer as per package terms." : "Departure based on selected return flight: " + flight.inbound] }
  ];
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="mb-5"><h2 className="text-xl font-bold text-slate-900">Detailed Itinerary</h2><p className="mt-1 text-xs text-slate-500">Itinerary updates based on selected package, flight and hotel.</p></div>
      <div className="relative space-y-5 border-l border-dashed border-[#b51f29]/40 pl-6">
        {days.map((day) => <div key={day.day} className="relative rounded-2xl bg-slate-50 p-4"><div className="absolute -left-[33px] top-6 h-3 w-3 rounded-full bg-[#b51f29]" /><div className="grid gap-4 md:grid-cols-[160px_1fr]"><div className="relative h-32 overflow-hidden rounded-xl"><SmartImage src={day.image} alt={day.title} className="h-full w-full object-cover" /><span className="absolute left-2 top-2 rounded-full bg-[#b51f29] px-3 py-1 text-[10px] font-bold text-white">{day.day}</span></div><div><h3 className="text-lg font-bold text-slate-900">{day.title}</h3><ul className="mt-3 space-y-2 text-sm text-slate-600">{day.points.map((point) => <li key={point}>⊕ {point}</li>)}</ul></div></div></div>)}
      </div>
    </div>
  );
}

function PackageInclusionsExclusions() {
  const inclusions = [
    "Return economy class airfare on mentioned airline.",
    "Airport taxes for India and China.",
    "Return airport transfer as per group only.",
    "04 Night’s accommodation on mentioned hotel.",
    "Fairground transfers by Luxury AC coach as per group.",
    "Daily buffet breakfast at the hotel.",
    "Daily Indian Dinner comfort of the hotel with soft and hard drinks (soda, soft drinks, juice, whiskey and beer).",
    "City tour of Shanghai with shopping drop.",
    "Group Visa Charges.",
    "Overseas Travel Insurance.",
    "Exclusive Travel Kit.",
    "Services of Red Carpet’s Tour Manager."
  ];

  const exclusions = [
    "Optional Activities: Any activities or excursions not mentioned in the inclusions are not covered by the package.",
    "Personal Expenses: Items of a personal nature such as laundry, souvenirs, phone calls, and minibar charges are not included.",
    "Pre/Post Accommodation: Additional nights before or after your included hotel stay will incur an extra charge of USD 130 per night, including room and breakfast only.",
    "Individual Transfers: Transfers outside of the scheduled group transfers will cost USD 100 per van, per way.",
    "Additional Travel Insurance Cost depending upon the age of the traveler ie 55 years and above.",
    "This package includes a Group Visa Charges.",
    "Urgent visa processing Single or double-entry visas will incur additional charges.",
    "Additional Charges if anyone requires Sticker Visa: Rs 5500/- Per Person.",
    "Visa Services: The following visa-related expenses are not included: Invitation Charges, VFS Premium Lounge Charges & Courier Charges",
    "EXTRAS.",
    "GST@ 05 % will be payable on total package cost.",
    "Tips to Guide 25 USD.",
    "If any increase in visa & insurance charges."
  ];

  return (
    <section className="mt-8 space-y-8">
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b bg-gradient-to-r from-[#fff4f5] via-white to-white px-5 py-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#b51f29]">Tour Package Details</p>
              <h2 className="text-xl font-bold text-slate-950">Package Inclusions & Exclusions</h2>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-bold text-green-700">Package Inclusions</h3>
            <div className="space-y-3">
              {inclusions.map((item, index) => (
                <div key={index} className="flex items-start gap-3 rounded-xl bg-green-50 p-3 text-sm text-slate-700">
                  <span className="mt-0.5 text-green-700">✓</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-red-700">Package Exclusions</h3>
            <div className="space-y-3">
              {exclusions.map((item, index) => (
                <div key={index} className="flex items-start gap-3 rounded-xl bg-red-50 p-3 text-sm text-slate-700">
                  <span className="mt-0.5 text-red-700">✕</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="mt-2 text-sm text-gray-500">Everything you need to know before booking your package.</p>
        </div>

        <div className="space-y-4">
          {[
            {
              question: "Is visa assistance included in the package?",
              answer: "Yes, complete visa documentation and assistance will be provided by our team."
            },
            {
              question: "Are airport transfers included?",
              answer: "Yes, airport pick-up and drop-off along with fairground transfers are included as per itinerary."
            },
            {
              question: "Will Indian meals be available?",
              answer: "Yes, Indian meals can be arranged during the tour depending on the selected package inclusions."
            },
            {
              question: "Can I customize my travel dates or hotel stay?",
              answer: "Yes, customized options are available based on flight availability and hotel upgrades."
            },
            {
              question: "How can I confirm my booking?",
              answer: "You can confirm your booking by completing the online form and making the required payment."
            }
          ].map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-5 transition-all duration-200 hover:border-red-200 hover:bg-white"
            >
              <h3 className="text-base font-semibold text-gray-900">{faq.question}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-12 w-full bg-[#3f0b10] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.25fr_.8fr_.9fr_1.25fr]">
          <div>
            <div className="inline-flex rounded-xl bg-[#b51f29] px-4 py-3 text-2xl font-bold text-white">RC<span className="text-sm">TRIPS</span></div>
            <p className="mt-4 text-sm leading-6 text-white/70">Red Carpet Tours Pvt. Ltd. specializes in international trade fair delegations, business tours, visa assistance, hotels, flights and MICE travel support.</p>
            <p className="mt-4 text-sm font-bold text-white">Since 2007</p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/60">Quick Links</h3>
            <div className="mt-4 space-y-2 text-sm text-white/75">
              <p>Home</p>
              <p>Trade Fairs</p>
              <p>Services</p>
              <p>About Us</p>
              <p>Contact Us</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/60">Legal</h3>
            <div className="mt-4 space-y-2 text-sm text-white/75">
              <p>Privacy Policy</p>
              <p>Terms & Conditions</p>
              <p>Copyright Policy</p>
              <p>Cancellation & Refund</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/60">Corporate Office</h3>
            <div className="mt-4 space-y-3 text-sm leading-6 text-white/75">
              <p><b className="text-white">New Delhi</b><br />23/1, First Floor, East Patel Nagar, New Delhi - 110008, India</p>
              <p><b className="text-white">Call / WhatsApp:</b> +91-7290012474</p>
              <p><b className="text-white">Email:</b> info@rctrips.com</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 text-center text-xs text-white/55">
          Copyright 2024 Red Carpet Tours Pvt. Ltd. India. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

function BookingDetailsModal(props) {
  const [modalStep, setModalStep] = useState(1);
  const [consent, setConsent] = useState(false);
  const totalSteps = 5;
  const stepLabels = ["Company", "Travellers", "Consent", "Preview", "Done"];
  const isInline = props.inline;

  function nextStep() {
    if (modalStep === 3 && !consent) return;
    setModalStep(Math.min(totalSteps, modalStep + 1));
  }

  function previousStep() {
    setModalStep(Math.max(1, modalStep - 1));
  }

  return (
    <div className={isInline ? "rounded-[28px] bg-white shadow-sm ring-1 ring-slate-200" : "fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/75 p-6 backdrop-blur-md"}>
      <div className={cls("relative flex w-full overflow-hidden rounded-[28px] bg-white ring-1 ring-white/20", isInline ? "min-h-[760px] shadow-sm" : "h-[86vh] max-w-6xl shadow-2xl")}>
        <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-[#8f1820] via-[#b51f29] to-[#d94852]" />

        <div className="grid h-full w-full min-h-0 lg:grid-cols-[280px_1fr]">
          <aside className="hidden h-full overflow-hidden bg-gradient-to-b from-[#3f0b10] via-[#8f1820] to-[#b51f29] p-5 text-white lg:flex lg:flex-col">
            <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">RC Trips</p>
              <h2 className="mt-2 text-2xl font-bold leading-tight">Complete Booking Details</h2>
              <p className="mt-2 text-xs leading-5 text-white/75">Fill company and traveller information. Preview everything before payment.</p>
            </div>

            <div className="mt-5 space-y-2">
              {stepLabels.map((label, index) => {
                const stepNumber = index + 1;
                const active = modalStep === stepNumber;
                const done = modalStep > stepNumber;
                return (
                  <div key={label} className={cls("flex items-center gap-3 rounded-2xl p-3 transition", active ? "bg-white text-[#b51f29] shadow-lg" : done ? "bg-white/15 text-white" : "text-white/65")}>
                    <div className={cls("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold", active ? "bg-[#b51f29] text-white" : done ? "bg-green-500 text-white" : "bg-white/10 text-white")}>{done ? "✓" : stepNumber}</div>
                    <div>
                      <p className="font-bold">{label}</p>
                      <p className={cls("text-xs", active ? "text-[#b51f29]/70" : "text-white/50")}>{index === 0 ? "Business information" : index === 1 ? "All passenger data" : index === 2 ? "Terms approval" : index === 3 ? "Review before submit" : "Ready for payment"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          <section className="flex h-full min-h-0 min-w-0 flex-col">
            <div className="flex shrink-0 items-start justify-between gap-4 border-b bg-white px-6 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#b51f29]">Step {modalStep} of {totalSteps}</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950 md:text-2xl">{modalStep === 1 ? "Company Details" : modalStep === 2 ? "Traveller Details" : modalStep === 3 ? "Consent & Terms" : modalStep === 4 ? "Preview & Confirm" : "Details Submitted"}</h2>
                <p className="mt-1 text-sm text-slate-500">{modalStep === 1 ? "Enter billing and company information." : modalStep === 2 ? "Add details for each selected traveller." : modalStep === 3 ? "Confirm consent before preview." : modalStep === 4 ? "Check all details before final submit." : "You can now continue to payment."}</p>
              </div>
              <button type="button" onClick={props.onClose} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-2xl font-bold text-slate-700 transition hover:bg-[#b51f29] hover:text-white">×</button>
            </div>

            <div className="border-b bg-slate-50 px-6 py-4 md:px-8 lg:hidden">
              <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold">
                {stepLabels.map((label, index) => {
                  const stepNumber = index + 1;
                  return <div key={label} className={cls("rounded-xl px-2 py-2", modalStep === stepNumber ? "bg-[#b51f29] text-white" : modalStep > stepNumber ? "bg-green-100 text-green-700" : "bg-white text-slate-500")}>{modalStep > stepNumber ? "✓" : stepNumber}</div>;
                })}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-[#f8fafc] p-5">
              {modalStep === 1 ? (
                <div className="mx-auto max-w-4xl">
                  <div className="mb-4 rounded-2xl border border-[#ead0d3] bg-white p-4 shadow-sm">
                    <label className="flex items-start gap-3 text-sm font-bold text-slate-800"><input type="checkbox" checked={props.company.tds} onChange={(event) => props.setCompany({ ...props.company, tds: event.target.checked })} className="mt-1 h-4 w-4 accent-[#b51f29]" /> I wish to deduct TDS from the package amount</label>
                  </div>
                  <div className="grid gap-x-5 gap-y-3 md:grid-cols-2">
                    <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Company Name</span><input value={props.company.name} onChange={(e) => props.setCompany({ ...props.company, name: e.target.value })} placeholder="Enter company name" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" /></label>
                    <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Company Email</span><input value={props.company.email} onChange={(e) => props.setCompany({ ...props.company, email: e.target.value })} placeholder="Enter company email" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" /></label>
                    <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Mobile Number</span><input value={props.company.mobile} onChange={(e) => props.setCompany({ ...props.company, mobile: e.target.value })} placeholder="Enter mobile number" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" /></label>
                    <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Company Address</span><input value={props.company.address} onChange={(e) => props.setCompany({ ...props.company, address: e.target.value })} placeholder="Enter company address" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" /></label>
                    <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Nationality</span><input value={props.company.nationality} onChange={(e) => props.setCompany({ ...props.company, nationality: e.target.value })} placeholder="Nationality" className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none" /></label>
                    <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">GST Number</span><input value={props.company.gst} onChange={(e) => props.setCompany({ ...props.company, gst: e.target.value })} placeholder="Enter GST number" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" /></label>
                    <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Company PAN</span><input value={props.company.pan} onChange={(e) => props.setCompany({ ...props.company, pan: e.target.value })} placeholder="Enter PAN" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" /></label>
                    <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">GST State</span><select value={props.company.gstState} onChange={(e) => props.setCompany({ ...props.company, gstState: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10"><option value="">Select GST State</option><option>Delhi</option><option>Maharashtra</option><option>Gujarat</option><option>Tamil Nadu</option><option>Telangana</option></select></label>
                  </div>
                </div>
              ) : null}

              {modalStep === 2 ? (
                <div className="mx-auto max-w-5xl">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border bg-white p-5 shadow-sm">
                    <div><h3 className="text-xl font-bold">Traveller Details</h3><p className="mt-1 text-sm text-slate-500">Fill details for each selected traveller.</p></div>
                    <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-2"><button type="button" onClick={() => props.updateTravellerCount(props.travellerCount - 1)} className="h-10 w-10 rounded-xl border border-[#b51f29] bg-white text-[#b51f29]">−</button><b className="min-w-6 text-center text-lg">{props.travellerCount}</b><button type="button" onClick={() => props.updateTravellerCount(props.travellerCount + 1)} className="h-10 w-10 rounded-xl border border-[#b51f29] bg-white text-[#b51f29]">+</button></div>
                  </div>
                  <div className="space-y-6">
                    {props.travellers.map((traveller, index) => (
                      <div key={index} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between bg-gradient-to-r from-[#fff4f5] to-white px-5 py-4"><p className="font-bold text-[#b51f29]">Traveller {index + 1}</p><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 shadow-sm">Passenger</span></div>
                        <div className="grid gap-5 p-5 md:grid-cols-2">
                          <input value={traveller.name} onChange={(e) => props.updateTraveller(index, "name", e.target.value)} placeholder="Full Name" className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" />
                          <input value={traveller.email} onChange={(e) => props.updateTraveller(index, "email", e.target.value)} placeholder="Email" className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" />
                          <input value={traveller.contact} onChange={(e) => props.updateTraveller(index, "contact", e.target.value)} placeholder="Contact Number" className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" />
                          <input value={traveller.nationality} onChange={(e) => props.updateTraveller(index, "nationality", e.target.value)} placeholder="Nationality" className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" />
                          <input value={traveller.passport} onChange={(e) => props.updateTraveller(index, "passport", e.target.value)} placeholder="Passport Number" className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" />
                          <input value={traveller.pan} onChange={(e) => props.updateTraveller(index, "pan", e.target.value)} placeholder="PAN Number" className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" />
                          <input value={traveller.dob} onChange={(e) => props.updateTraveller(index, "dob", e.target.value)} type="date" className="rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" />
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"><b className="mr-3">Meal:</b>{["Veg", "Non-Veg", "Jain"].map((meal) => <label key={meal} className="mr-3 inline-flex items-center gap-1 text-sm"><input type="radio" checked={traveller.meal === meal} onChange={() => props.updateTraveller(index, "meal", meal)} className="accent-[#b51f29]" /> {meal}</label>)}</div>
                          <label className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm font-semibold">Upload Passport Copy <input type="file" className="mt-2 block text-xs" /></label>
                          <label className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm font-semibold">Upload PAN Card Copy <input type="file" className="mt-2 block text-xs" /></label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {modalStep === 3 ? (
                <div className="mx-auto max-w-3xl">
                  <div className="rounded-[28px] border bg-white p-7 shadow-sm">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff4f5] text-2xl">✓</div>
                    <h3 className="text-2xl font-bold">Terms & Consent</h3>
                    <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
                      <p>By submitting this booking request, the customer confirms that all details provided are correct and may be used by RC Trips for booking, visa assistance, travel coordination and payment processing.</p>
                      <p>Flight, hotel and visa services are subject to availability and final confirmation. Cancellation, refund and date-change rules will apply as per supplier and company policy.</p>
                      <p>RC Trips team may contact the customer through phone, WhatsApp or email for booking follow-up and document completion.</p>
                    </div>
                    <label className="mt-7 flex items-start gap-3 rounded-2xl border border-[#ead0d3] bg-[#fff4f5] p-5 font-bold"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-[#b51f29]" /> I agree to the Terms & Conditions and consent to submit my booking details.</label>
                  </div>
                </div>
              ) : null}

              {modalStep === 4 ? (
                <div className="mx-auto max-w-5xl space-y-5 text-sm">
                  <div className="rounded-3xl border bg-white p-6 shadow-sm"><div className="mb-4 flex justify-between"><b className="text-xl">Package Details</b><button type="button" onClick={() => setModalStep(1)} className="rounded-xl bg-[#fff4f5] px-4 py-2 font-bold text-[#b51f29]">Edit</button></div><div className="grid gap-3 md:grid-cols-2"><p><b>Departure:</b> {props.pkg.city}</p><p><b>Flight:</b> {props.flight.airline}</p><p><b>Hotel:</b> {props.hotel.name}</p><p><b>Occupancy:</b> {props.occupancy === "single" ? "Single Sharing" : "Twin Sharing"}</p><p><b>Total Travellers:</b> {props.travellerCount}</p></div></div>
                  <div className="rounded-3xl border bg-white p-6 shadow-sm"><div className="mb-4 flex justify-between"><b className="text-xl">Company Details</b><button type="button" onClick={() => setModalStep(1)} className="rounded-xl bg-[#fff4f5] px-4 py-2 font-bold text-[#b51f29]">Edit</button></div><div className="grid gap-3 md:grid-cols-2"><p><b>TDS Deduction:</b> {props.company.tds ? "Yes" : "No"}</p><p><b>Company Name:</b> {props.company.name || "-"}</p><p><b>Email:</b> {props.company.email || "-"}</p><p><b>Mobile:</b> {props.company.mobile || "-"}</p><p><b>GST State:</b> {props.company.gstState || "-"}</p></div></div>
                  <div className="rounded-3xl border bg-white p-6 shadow-sm"><div className="mb-4 flex justify-between"><b className="text-xl">Traveller Details</b><button type="button" onClick={() => setModalStep(2)} className="rounded-xl bg-[#fff4f5] px-4 py-2 font-bold text-[#b51f29]">Edit</button></div>{props.travellers.map((traveller, index) => <div key={index} className="mt-3 rounded-2xl bg-slate-50 p-4"><b className="text-[#b51f29]">Traveller {index + 1}</b><div className="mt-2 grid gap-2 md:grid-cols-2"><p>Name: {traveller.name || "-"}</p><p>Email: {traveller.email || "-"}</p><p>Contact: {traveller.contact || "-"}</p><p>Meal Preference: {traveller.meal}</p></div></div>)}</div>
                </div>
              ) : null}

              {modalStep === 5 ? (
                <div className="mx-auto max-w-xl py-10 text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-600 text-5xl text-white shadow-lg">✓</div>
                  <h3 className="mt-6 text-4xl font-bold text-green-700">Thank You!</h3>
                  <p className="mx-auto mt-4 max-w-xl text-slate-600">Your booking details have been submitted successfully. You can now continue to payment and choose 50% payment or full payment.</p>
                </div>
              ) : null}
            </div>

            <div className="flex shrink-0 justify-between gap-3 border-t bg-white px-6 py-4">
              {modalStep > 1 && modalStep < 5 ? <button type="button" onClick={previousStep} className="rounded-2xl border px-6 py-3 font-bold text-slate-600 transition hover:bg-slate-50">Back</button> : <div />}
              {modalStep < 4 ? <button type="button" onClick={nextStep} disabled={modalStep === 3 && !consent} className={cls("rounded-2xl px-7 py-3 font-bold text-white shadow-lg transition", modalStep === 3 && !consent ? "bg-slate-300 shadow-none" : "bg-[#b51f29] hover:bg-[#8f1820]")}>Next</button> : null}
              {modalStep === 4 ? <button type="button" onClick={() => { props.onSubmit(); setModalStep(5); }} className="rounded-2xl bg-[#b51f29] px-7 py-3 font-bold text-white shadow-lg transition hover:bg-[#8f1820]">Approve & Submit</button> : null}
              {modalStep === 5 ? <button type="button" onClick={props.onContinuePayment} className="rounded-2xl bg-green-700 px-7 py-3 font-bold text-white shadow-lg transition hover:bg-green-800">Continue to Payment</button> : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InlineBookingDetailsForm(props) {
  const [formStep, setFormStep] = useState(1);
  const [consent, setConsent] = useState(false);
  const totalSteps = 5;
  const steps = [
    { label: "Company", helper: "Business information" },
    { label: "Travellers", helper: "Passenger data" },
    { label: "Consent", helper: "Terms approval" },
    { label: "Preview", helper: "Review details" },
    { label: "Done", helper: "Payment ready" }
  ];

  function nextStep() {
    if (formStep === 3 && !consent) return;
    setFormStep(Math.min(totalSteps, formStep + 1));
  }

  function previousStep() {
    setFormStep(Math.max(1, formStep - 1));
  }

  const stepTitle = formStep === 1 ? "Company Details" : formStep === 2 ? "Traveller Details" : formStep === 3 ? "Consent & Terms" : formStep === 4 ? "Preview & Confirm" : "Details Submitted";
  const stepHelp = formStep === 1 ? "Enter billing and company information." : formStep === 2 ? "Add details for each selected traveller." : formStep === 3 ? "Confirm consent before preview." : formStep === 4 ? "Check all details before final submit." : "You can now continue to payment.";

  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-slate-200">
      <div className="border-b border-slate-200 bg-gradient-to-r from-white via-[#fff4f5] to-white px-5 py-5 lg:px-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#b51f29]">Complete Booking Details</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Fill Company & Traveller Information</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Complete your booking details here. Your selected package summary stays available on the right.</p>
          </div>
          <button type="button" onClick={props.onBackToPackage} className="rounded-xl border border-[#b51f29] bg-white px-4 py-2 text-xs font-bold text-[#b51f29] transition hover:bg-[#fff4f5]">Change Package</button>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-5">
          {steps.map((step, index) => {
            const number = index + 1;
            const active = formStep === number;
            const done = formStep > number;
            return (
              <button
                type="button"
                key={step.label}
                onClick={() => setFormStep(number)}
                className={cls(
                  "flex min-h-[72px] items-center gap-3 rounded-2xl border px-3 py-3 text-left transition",
                  active ? "border-[#b51f29] bg-[#fff4f5] shadow-sm ring-2 ring-[#b51f29]/10" : done ? "border-green-200 bg-green-50" : "border-slate-200 bg-white hover:border-[#ead0d3]"
                )}
              >
                <span className={cls("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold", active ? "bg-[#b51f29] text-white" : done ? "bg-green-600 text-white" : "bg-slate-100 text-slate-500")}>{done ? "✓" : number}</span>
                <span className="min-w-0">
                  <span className={cls("block text-sm font-extrabold", active ? "text-[#b51f29]" : "text-slate-900")}>{step.label}</span>
                  <span className="mt-0.5 block text-[11px] leading-4 text-slate-500">{step.helper}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-[#f8fafc] px-5 py-6 lg:px-7">
        <div className="mb-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#b51f29]">Step {formStep} of {totalSteps}</p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-950">{stepTitle}</h2>
          <p className="mt-1 text-sm text-slate-500">{stepHelp}</p>
        </div>

        {formStep === 1 ? (
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <label className="mb-5 flex items-start gap-3 rounded-2xl border border-[#ead0d3] bg-[#fff4f5] p-4 text-sm font-bold text-slate-800">
              <input type="checkbox" checked={props.company.tds} onChange={(event) => props.setCompany({ ...props.company, tds: event.target.checked })} className="mt-1 h-4 w-4 accent-[#b51f29]" />
              I wish to deduct TDS from the package amount
            </label>
            <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
              <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Company Name</span><input value={props.company.name} onChange={(e) => props.setCompany({ ...props.company, name: e.target.value })} placeholder="Enter company name" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" /></label>
              <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Company Email</span><input value={props.company.email} onChange={(e) => props.setCompany({ ...props.company, email: e.target.value })} placeholder="Enter company email" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" /></label>
              <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Mobile Number</span><input value={props.company.mobile} onChange={(e) => props.setCompany({ ...props.company, mobile: e.target.value })} placeholder="Enter mobile number" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" /></label>
              <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Company Address</span><input value={props.company.address} onChange={(e) => props.setCompany({ ...props.company, address: e.target.value })} placeholder="Enter company address" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" /></label>
              <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Nationality</span><input value={props.company.nationality} onChange={(e) => props.setCompany({ ...props.company, nationality: e.target.value })} placeholder="Nationality" className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none" /></label>
              <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">GST Number</span><input value={props.company.gst} onChange={(e) => props.setCompany({ ...props.company, gst: e.target.value })} placeholder="Enter GST number" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" /></label>
              <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Company PAN</span><input value={props.company.pan} onChange={(e) => props.setCompany({ ...props.company, pan: e.target.value })} placeholder="Enter PAN" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" /></label>
              <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">GST State</span><select value={props.company.gstState} onChange={(e) => props.setCompany({ ...props.company, gstState: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10"><option value="">Select GST State</option><option>Delhi</option><option>Maharashtra</option><option>Gujarat</option><option>Tamil Nadu</option><option>Telangana</option></select></label>
            </div>
          </div>
        ) : null}

        {formStep === 2 ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div><h3 className="text-xl font-extrabold text-slate-950">Traveller Details</h3><p className="mt-1 text-sm text-slate-500">Fill details for each selected traveller.</p></div>
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-2"><button type="button" onClick={() => props.updateTravellerCount(props.travellerCount - 1)} className="h-10 w-10 rounded-xl border border-[#b51f29] bg-white text-[#b51f29]">−</button><b className="min-w-6 text-center text-lg">{props.travellerCount}</b><button type="button" onClick={() => props.updateTravellerCount(props.travellerCount + 1)} className="h-10 w-10 rounded-xl border border-[#b51f29] bg-white text-[#b51f29]">+</button></div>
            </div>
            {props.travellers.map((traveller, index) => (
              <div key={index} className="overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center justify-between border-b bg-gradient-to-r from-[#fff4f5] to-white px-5 py-4"><p className="font-extrabold text-[#b51f29]">Traveller {index + 1}</p><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 shadow-sm">Passenger</span></div>
                <div className="grid gap-4 p-5 md:grid-cols-2">
                  <input value={traveller.name} onChange={(e) => props.updateTraveller(index, "name", e.target.value)} placeholder="Full Name" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" />
                  <input value={traveller.email} onChange={(e) => props.updateTraveller(index, "email", e.target.value)} placeholder="Email" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" />
                  <input value={traveller.contact} onChange={(e) => props.updateTraveller(index, "contact", e.target.value)} placeholder="Contact Number" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" />
                  <input value={traveller.nationality} onChange={(e) => props.updateTraveller(index, "nationality", e.target.value)} placeholder="Nationality" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" />
                  <input value={traveller.passport} onChange={(e) => props.updateTraveller(index, "passport", e.target.value)} placeholder="Passport Number" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" />
                  <input value={traveller.pan} onChange={(e) => props.updateTraveller(index, "pan", e.target.value)} placeholder="PAN Number" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" />
                  <input value={traveller.dob} onChange={(e) => props.updateTraveller(index, "dob", e.target.value)} type="date" className="h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" />
                  <div className="flex min-h-12 flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                    <b className="text-sm text-slate-800">Meal:</b>
                    {["Veg", "Non-Veg", "Jain"].map((meal) => (
                      <label key={meal} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                        <input type="radio" checked={traveller.meal === meal} onChange={() => props.updateTraveller(index, "meal", meal)} className="accent-[#b51f29]" /> {meal}
                      </label>
                    ))}
                  </div>
                  <div className="grid gap-3 rounded-xl border border-dashed border-[#ead0d3] bg-[#fff4f5] p-4 md:col-span-2 md:grid-cols-2">
                    <label className="block rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200"><span className="mb-2 block text-sm font-extrabold text-slate-800">Passport Copy Upload</span><input type="file" accept=".pdf,.jpg,.jpeg,.png" className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-[#b51f29] file:px-3 file:py-2 file:text-xs file:font-bold file:text-white" /></label>
                    <label className="block rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200"><span className="mb-2 block text-sm font-extrabold text-slate-800">PAN Card Upload</span><input type="file" accept=".pdf,.jpg,.jpeg,.png" className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-[#b51f29] file:px-3 file:py-2 file:text-xs file:font-bold file:text-white" /></label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {formStep === 3 ? (
          <div className="rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-2xl font-extrabold text-slate-950">Terms & Consent</h3>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
              <p>By submitting this booking request, the customer confirms that all details provided are correct and may be used by RC Trips for booking, visa assistance, travel coordination and payment processing.</p>
              <p>Flight, hotel and visa services are subject to availability and final confirmation. Cancellation, refund and date-change rules will apply as per supplier and company policy.</p>
            </div>
            <label className="mt-6 flex items-start gap-3 rounded-2xl border border-[#ead0d3] bg-[#fff4f5] p-5 font-bold"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-[#b51f29]" /> I agree to the Terms & Conditions and consent to submit my booking details.</label>
          </div>
        ) : null}

        {formStep === 4 ? (
          <div className="space-y-5 text-sm">
            <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200"><b className="text-xl text-slate-950">Package Details</b><div className="mt-4 grid gap-3 md:grid-cols-2"><p><b>Departure:</b> {props.pkg.city}</p><p><b>Flight:</b> {props.flight.airline}</p><p><b>Hotel:</b> {props.hotel.name}</p><p><b>Total Travellers:</b> {props.travellerCount}</p></div></div>
            <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200"><b className="text-xl text-slate-950">Company Details</b><div className="mt-4 grid gap-3 md:grid-cols-2"><p><b>Company:</b> {props.company.name || "-"}</p><p><b>Email:</b> {props.company.email || "-"}</p><p><b>Mobile:</b> {props.company.mobile || "-"}</p><p><b>GST State:</b> {props.company.gstState || "-"}</p></div></div>
            <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200"><b className="text-xl text-slate-950">Traveller Details</b>{props.travellers.map((traveller, index) => <div key={index} className="mt-3 rounded-2xl bg-slate-50 p-4"><b className="text-[#b51f29]">Traveller {index + 1}</b><div className="mt-2 grid gap-2 md:grid-cols-2"><p>Name: {traveller.name || "-"}</p><p>Email: {traveller.email || "-"}</p><p>Contact: {traveller.contact || "-"}</p><p>Meal: {traveller.meal}</p></div></div>)}</div>
          </div>
        ) : null}

        {formStep === 5 ? (
          <div className="rounded-[24px] bg-white px-6 py-12 text-center shadow-sm ring-1 ring-slate-200">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-600 text-4xl text-white shadow-lg">✓</div>
            <h3 className="mt-6 text-3xl font-extrabold text-green-700">Thank You!</h3>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">Your booking details have been submitted successfully. Continue to payment from the booking summary.</p>
          </div>
        ) : null}
      </div>

      <div className="flex justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4 lg:px-7">
        {formStep > 1 && formStep < 5 ? <button type="button" onClick={previousStep} className="rounded-xl border px-6 py-3 font-bold text-slate-600 transition hover:bg-slate-50">Back</button> : <div />}
        {formStep < 4 ? <button type="button" onClick={nextStep} disabled={formStep === 3 && !consent} className={cls("rounded-xl px-7 py-3 font-bold text-white shadow-lg transition", formStep === 3 && !consent ? "bg-slate-300 shadow-none" : "bg-[#b51f29] hover:bg-[#8f1820]")}>Next</button> : null}
        {formStep === 4 ? <button type="button" onClick={() => { props.onSubmit(); setFormStep(5); props.onContinuePayment(); }} className="rounded-xl bg-[#b51f29] px-7 py-3 font-bold text-white shadow-lg transition hover:bg-[#8f1820]">Approve & Submit</button> : null}
        {formStep === 5 ? <div /> : null}
      </div>
    </div>
  );
}

function BookingPaymentControls({ coupon, setCoupon, couponApplied, setCouponApplied, paymentType, setPaymentType, t, showPayment = false }) {
  const isValidCoupon = couponDiscountFromCode(coupon) > 0;

  return (
    <div className="mt-2.5 space-y-2.5">
      <div className="rounded-xl border border-[#ead0d3] bg-[#fff4f5] p-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase text-[#b51f29]">Coupon Code</p>
            <p className="text-[11px] leading-4 text-slate-500">Use WELCOME500 to get {inr(500)} off.</p>
          </div>
          {couponApplied ? <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-extrabold text-green-700">Applied</span> : null}
        </div>
        <div className="mt-2 flex gap-2">
          <input value={coupon} onChange={(event) => { setCoupon(event.target.value.toUpperCase()); setCouponApplied(false); }} placeholder="WELCOME500" className="min-w-0 flex-1 rounded-xl border border-white bg-white px-3 py-1.5 text-sm font-bold uppercase outline-none focus:border-[#b51f29] focus:ring-4 focus:ring-[#b51f29]/10" />
          <button type="button" onClick={() => setCouponApplied(isValidCoupon)} className="rounded-xl bg-[#b51f29] px-4 py-1.5 text-sm font-extrabold text-white">Apply</button>
        </div>
        {couponApplied ? <p className="mt-2 text-xs font-bold text-green-700">Coupon discount: - {inr(t.coupon)}</p> : null}
        {coupon && !couponApplied && !isValidCoupon ? <p className="mt-2 text-xs font-bold text-[#b51f29]">Enter WELCOME500 to apply this offer.</p> : null}
      </div>

      {showPayment ? <div className="rounded-xl border border-slate-200 bg-white p-2">
        <p className="text-sm font-extrabold text-slate-900">Payment Preference</p>
        <div className="mt-1.5 grid gap-1.5">
          <label className={cls("flex cursor-pointer items-start gap-2.5 rounded-xl border p-2 transition", paymentType === "partial" ? "border-[#b51f29] bg-[#fff4f5]" : "border-slate-200 bg-slate-50")}>
            <input type="radio" checked={paymentType === "partial"} onChange={() => setPaymentType("partial")} className="mt-1 accent-[#b51f29]" />
            <span><b className="text-sm">Pay 50% Now</b><span className="block text-[11px] leading-4 text-slate-500">Pay {inr(t.payableNow)} now, balance {inr(t.balance)} later.</span></span>
          </label>
          <label className={cls("relative flex cursor-pointer items-start gap-2.5 rounded-xl border p-2 transition", paymentType === "full" ? "border-green-500 bg-green-50 ring-2 ring-green-100" : "border-slate-200 bg-slate-50")}>
            <span className="absolute -top-2 right-3 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-extrabold text-white">Save {inr(5000)}</span>
            <input type="radio" checked={paymentType === "full"} onChange={() => setPaymentType("full")} className="mt-1 accent-green-600" />
            <span><b className="text-sm">Pay Full Amount</b><span className="block text-[11px] leading-4 text-slate-500">Extra {inr(5000)} discount, coupon still separate.</span></span>
          </label>
        </div>
      </div> : null}
    </div>
  );
}

function BookingPanel(props) {
  const [panelMode, setPanelMode] = useState("booking");
  const [inquiry, setInquiry] = useState({ name: "", mobile: "", email: "", company: "", message: "" });
  const [paymentType, setPaymentType] = useState("partial");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const t = totals({ pkg: props.pkg, flight: props.flight, hotel: props.hotel, occupancy: props.occupancy, travellerCount: props.travellerCount, allocationMode: props.allocationMode, allocations: props.allocations, coupon, couponApplied, paymentType });

  function updateTravellerCount(nextCount) {
    props.updateTravellerCount(nextCount);
  }

  function updateTraveller(index, field, value) {
    props.updateTraveller(index, field, value);
  }

  function updateAllocation(index, patch) {
    props.updateAllocation(index, patch);
  }

  const heading = props.step === 1 ? "Booking Summary" : "Payment";

  return (
    <aside className="self-start overflow-hidden rounded-[26px] bg-white shadow-lg ring-1 ring-slate-200 lg:sticky lg:top-[76px] lg:max-h-[calc(100vh-5.5rem)] lg:flex lg:flex-col">
      <div className="bg-[#b51f29] px-5 pb-3.5 pt-3 text-white">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold">{heading}</h3>
          <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white/90">{props.pkg.title}</span>
        </div>
      </div>
      <div className="p-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">

        {props.step === 1 && panelMode === "inquiry" ? <div><div className="rounded-xl bg-[#fff4f5] p-3"><p className="text-xs font-bold uppercase text-[#b51f29]">Quick Inquiry</p><h4 className="mt-1 text-lg font-bold">Get Package Details</h4><p className="mt-1.5 text-xs leading-5 text-slate-600">Submit your details and our travel expert will call you from +91-7290012474.</p></div><div className="mt-3 grid gap-2.5"><input value={inquiry.name} onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })} placeholder="Full Name *" className="rounded-xl border px-4 py-2.5 outline-none focus:border-[#b51f29]" /><input value={inquiry.mobile} onChange={(e) => setInquiry({ ...inquiry, mobile: e.target.value })} placeholder="Mobile Number *" className="rounded-xl border px-4 py-2.5 outline-none focus:border-[#b51f29]" /><input value={inquiry.email} onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })} placeholder="Email ID" className="rounded-xl border px-4 py-2.5 outline-none focus:border-[#b51f29]" /><input value={inquiry.company} onChange={(e) => setInquiry({ ...inquiry, company: e.target.value })} placeholder="Company Name" className="rounded-xl border px-4 py-2.5 outline-none focus:border-[#b51f29]" /><textarea value={inquiry.message} onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })} placeholder="Message / Requirement" rows={2} className="rounded-xl border px-4 py-2.5 outline-none focus:border-[#b51f29]" /></div><div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm"><p><b>Package:</b> {props.pkg.title}</p><p><b>Flight:</b> {props.flight.airline}</p><p><b>Hotel:</b> {props.hotel.name}</p></div><button type="button" onClick={() => setPanelMode("booking")} className="mt-4 w-full rounded-xl border border-[#b51f29] bg-white py-2.5 font-bold text-[#b51f29]">Back To Booking Summary</button><button type="button" className="mt-2.5 w-full rounded-xl bg-[#b51f29] py-2.5 font-bold text-white">Submit Inquiry</button></div> : null}

        {props.step === 1 && panelMode === "booking" ? <div><div className="space-y-3.5 text-sm leading-snug"><div><p className="text-[11px] uppercase text-slate-400">Selected Package</p><p className="mt-0.5 font-bold text-[#b51f29]">{props.pkg.title}</p></div><div><p className="text-[11px] uppercase text-slate-400">Selected Flight</p><p className="mt-0.5 font-bold">{props.flight.airline}</p></div><div><p className="text-[11px] uppercase text-slate-400">Selected Hotel</p><p className="mt-0.5 font-bold">{props.hotel.name}</p><p className="mt-1 text-xs font-semibold text-[#b51f29]">{props.occupancy === "single" ? "Single Sharing" : "Twin Sharing"}</p></div><div className="rounded-xl bg-slate-50 p-2.5"><div className="flex items-center justify-between"><div><span className="font-semibold">Travellers</span><p className="mt-0.5 text-[11px] leading-4 text-slate-500">Choose how flight and hotel apply.</p></div><div className="flex items-center gap-3"><button type="button" onClick={() => updateTravellerCount(props.travellerCount - 1)} className="h-7 w-7 rounded-lg border border-[#b51f29] text-[#b51f29]">−</button><b>{props.travellerCount}</b><button type="button" onClick={() => updateTravellerCount(props.travellerCount + 1)} className="h-7 w-7 rounded-lg border border-[#b51f29] text-[#b51f29]">+</button></div></div><div className="mt-2 grid grid-cols-2 gap-2"><button type="button" onClick={() => props.setAllocationMode("same")} className={cls("rounded-xl px-2 py-1.5 text-xs font-bold leading-tight transition", props.allocationMode === "same" ? "bg-[#b51f29] text-white" : "bg-white text-slate-600 ring-1 ring-slate-200")}><span className="block">Same for all</span><span className={cls("mt-0.5 block text-[10px] font-semibold", props.allocationMode === "same" ? "text-white/85" : "text-slate-400")}>same flight + hotel</span></button><button type="button" onClick={() => props.setAllocationMode("different")} className={cls("rounded-xl px-2 py-1.5 text-xs font-bold leading-tight transition", props.allocationMode === "different" ? "bg-[#b51f29] text-white" : "bg-white text-slate-600 ring-1 ring-slate-200")}><span className="block">Different</span><span className={cls("mt-0.5 block text-[10px] font-semibold", props.allocationMode === "different" ? "text-white/85" : "text-slate-400")}>choose each person</span></button></div></div>{props.allocationMode === "different" ? <div className="rounded-xl bg-[#fff4f5] p-3"><p className="text-xs font-bold text-[#b51f29]">Set options per traveller</p><p className="mt-1 text-[11px] leading-4 text-slate-500">Use this if travellers need different cities, flights or hotels.</p><div className="mt-3 space-y-3">{props.allocations.slice(0, props.travellerCount).map((allocation, index) => { const pkg = packages.find((item) => item.id === allocation.pkgId) || props.pkg; const flights = flightsByPackage[pkg.id] || flightsByPackage.land1; return <div key={index} className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200"><p className="mb-2 text-xs font-bold text-slate-700">Traveller {index + 1}</p><div className="grid gap-2"><select value={allocation.pkgId} onChange={(event) => { const nextPkgId = event.target.value; const nextFlights = flightsByPackage[nextPkgId] || flightsByPackage.land1; updateAllocation(index, { pkgId: nextPkgId, flightId: nextFlights[0].id }); }} className="rounded-lg border px-2 py-2 text-xs outline-none focus:border-[#b51f29]">{packages.map((item) => <option key={item.id} value={item.id}>{item.packageType === "land" ? "Without Flights" : item.city}</option>)}</select><select value={allocation.flightId} onChange={(event) => updateAllocation(index, { flightId: event.target.value })} className="rounded-lg border px-2 py-2 text-xs outline-none focus:border-[#b51f29]">{flights.map((flight) => <option key={flight.id} value={flight.id}>{flight.airline}</option>)}</select><select value={allocation.hotelId} onChange={(event) => updateAllocation(index, { hotelId: event.target.value })} className="rounded-lg border px-2 py-2 text-xs outline-none focus:border-[#b51f29]">{hotels.map((hotel) => <option key={hotel.id} value={hotel.id}>{hotel.id === "howard" ? "Howard Johnson" : "Radisson Blu"}</option>)}</select></div></div>; })}</div></div> : null}</div><div className="mt-3 border-t pt-2.5 text-sm"><div className="flex justify-between"><span>Package Amount</span><b>{inr(t.base)}</b></div><div className="mt-1.5 flex justify-between"><span>IGST 5%</span><b>{inr(t.igst)}</b></div><div className="mt-1.5 flex justify-between"><span>TCS 2%</span><b>{inr(t.tcs)}</b></div><div className="mt-2.5 flex justify-between border-t pt-2.5 text-2xl"><b>Total</b><b className="text-[#b51f29]">{inr(t.total)}</b></div></div>{props.detailsSubmitted ? <div className="mt-3 rounded-xl bg-green-50 p-3 text-sm font-bold text-green-700">Booking details submitted. Continue to payment below.</div> : null}
          <BookingPaymentControls coupon={coupon} setCoupon={setCoupon} couponApplied={couponApplied} setCouponApplied={setCouponApplied} paymentType={paymentType} setPaymentType={setPaymentType} t={t} /><button type="button" onClick={props.onShowBookingForm} className="mt-3 w-full rounded-xl bg-[#b51f29] py-2.5 font-bold text-white">{props.detailsSubmitted ? "Edit Booking Details" : "Fill Booking Details"}</button><button type="button" onClick={() => setPanelMode("inquiry")} className="mt-2 w-full rounded-xl border border-[#b51f29] bg-white py-2.5 font-bold text-[#b51f29]">Inquiry Now Before Booking</button></div> : null}

        {props.step === 4 ? (
          <div>
            <div className="mb-2 rounded-xl border border-[#ead0d3] bg-[#fff4f5] p-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-[#b51f29]">Review Before Payment</p>
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#b51f29] shadow-sm">Editable</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <button type="button" onClick={props.onShowBookingForm} className="rounded-xl bg-[#b51f29] px-3 py-1.5 text-xs font-bold text-white">Edit Details</button>
                <button type="button" onClick={props.onChangePackageClick} className="rounded-xl border border-[#b51f29] bg-white px-3 py-1.5 text-xs font-bold text-[#b51f29]">Change Package</button>
              </div>
            </div>

            <h4 className="text-base font-bold">Payment Options</h4>
            <div className="mt-2 rounded-xl bg-slate-50 p-2.5 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><b>{inr(t.base)}</b></div>
              <div className="mt-1 flex justify-between"><span>IGST 5%</span><b>{inr(t.igst)}</b></div>
              <div className="mt-1 flex justify-between"><span>TCS 2%</span><b>{inr(t.tcs)}</b></div>
              <div className="mt-1 flex justify-between text-green-700"><span>Coupon Discount</span><b>- {inr(t.coupon)}</b></div>
              <div className="mt-1 flex justify-between text-green-700"><span>Full Payment Discount</span><b>- {inr(t.fullDiscount)}</b></div>
              <div className="mt-2 flex justify-between border-t pt-2 text-lg"><b>Payable Now</b><b className="text-[#b51f29]">{inr(t.payableNow)}</b></div>
              {paymentType === "partial" ? <div className="mt-1 flex justify-between text-xs text-slate-500"><span>Balance Later</span><b>{inr(t.balance)}</b></div> : null}
            </div>
            <BookingPaymentControls coupon={coupon} setCoupon={setCoupon} couponApplied={couponApplied} setCouponApplied={setCouponApplied} paymentType={paymentType} setPaymentType={setPaymentType} t={t} showPayment={true} />
            <button type="button" className="mt-2 w-full rounded-xl bg-green-700 py-2.5 font-bold text-white">Proceed Payment</button>
          </div>
        ) : null}
      </div>

    </aside>
  );
}

function PackageDetailPage() {
  const packageSectionRef = useRef(null);
  const flightSectionRef = useRef(null);
  const hotelSectionRef = useRef(null);
  const [pkgId, setPkgId] = useState("mumbai");
  const selectedPackage = packages.find((item) => item.id === pkgId) || packages[0];
  const availableFlights = flightsByPackage[pkgId] || flightsByPackage.land1;
  const [flightId, setFlightId] = useState(availableFlights[0].id);
  const selectedFlight = availableFlights.find((item) => item.id === flightId) || availableFlights[0];
  const [hotelId, setHotelId] = useState("howard");
  const selectedHotel = hotels.find((item) => item.id === hotelId) || hotels[0];
  const [occupancy, setOccupancy] = useState("twin");
  const [activeHotelDetails, setActiveHotelDetails] = useState(null);
  const [travellerCount, setTravellerCount] = useState(1);
  const [step, setStep] = useState(1);
  const [packageTypeFilter, setPackageTypeFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [showBookingDetailsForm, setShowBookingDetailsForm] = useState(false);
  const [detailsSubmitted, setDetailsSubmitted] = useState(false);
  const [company, setCompany] = useState(createCompanyDetails);
  const [travellers, setTravellers] = useState([createTravellerDetails()]);
  const [allocationMode, setAllocationMode] = useState("same");
  const [allocations, setAllocations] = useState([{ pkgId: "mumbai", flightId: flightsByPackage.mumbai[0].id, hotelId: "howard", occupancy: "twin" }]);
  const cityOptions = Array.from(new Set(packages.filter((item) => item.packageType === "flight").map((item) => item.city)));
  const filteredPackages = packages.filter((item) => {
    const matchesType = packageTypeFilter === "all" || item.packageType === packageTypeFilter;
    const matchesCity = cityFilter === "all" || item.city === cityFilter;
    return matchesType && matchesCity;
  });

  function updateTravellerCount(nextCount) {
    const safeCount = Math.max(1, nextCount);
    setTravellerCount(safeCount);
    setTravellers((current) => {
      const next = current.slice();
      while (next.length < safeCount) next.push(createTravellerDetails());
      return next.slice(0, safeCount);
    });
    setAllocations((current) => {
      const next = current.slice();
      while (next.length < safeCount) next.push({ pkgId, flightId, hotelId, occupancy });
      return next.slice(0, safeCount);
    });
  }

  function updateTraveller(index, field, value) {
    setTravellers((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  }

  function updateAllocation(index, patch) {
    setAllocations((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  }

  function scrollToSection(ref) {
    window.setTimeout(function() {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
  }

  useEffect(function() {
    if (!filteredPackages.length || filteredPackages.some((item) => item.id === pkgId)) return;
    const nextPackage = filteredPackages[0];
    const nextFlights = flightsByPackage[nextPackage.id] || flightsByPackage.land1;
    setPkgId(nextPackage.id);
    setFlightId(nextFlights[0].id);
    setStep(1);
    setOccupancy("twin");
  }, [packageTypeFilter, cityFilter]);

  useEffect(function() {
    if (allocationMode !== "same") return;
    setAllocations((current) => current.map(() => ({ pkgId, flightId, hotelId, occupancy })));
  }, [allocationMode, pkgId, flightId, hotelId, occupancy]);

  function handlePackageChange(id) {
    const flights = flightsByPackage[id] || flightsByPackage.land1;
    setPkgId(id);
    setFlightId(flights[0].id);
    setStep(1);
    setOccupancy("twin");
    setShowBookingDetailsForm(false);
    scrollToSection(flightSectionRef);
  }

  function handleFlightChange(id) {
    setFlightId(id);
    scrollToSection(hotelSectionRef);
  }

  function handleChangePackageFromPayment() {
    setStep(1);
    setShowBookingDetailsForm(false);
    scrollToSection(packageSectionRef);
  }

  return (
    <>
      <StepHeader step={step} />
      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_380px]">
        <section>
          {showBookingDetailsForm ? (
            <InlineBookingDetailsForm
              pkg={selectedPackage}
              flight={selectedFlight}
              hotel={selectedHotel}
              occupancy={occupancy}
              travellerCount={travellerCount}
              updateTravellerCount={updateTravellerCount}
              company={company}
              setCompany={setCompany}
              travellers={travellers}
              updateTraveller={updateTraveller}
              onBackToPackage={() => setShowBookingDetailsForm(false)}
              onSubmit={() => setDetailsSubmitted(true)}
              onContinuePayment={() => {
                setDetailsSubmitted(true);
                setStep(4);
              }}
            />
          ) : (
            <>
          <TradeFairIntro pkg={selectedPackage} />
          <div ref={packageSectionRef} className="scroll-mt-24 mb-6 grid gap-5 lg:grid-cols-[1fr_360px]">
            <div>
              <h1 className="text-3xl font-bold text-[#b51f29]">Select Your Trade Fair Package</h1>
              <p className="mt-2 max-w-xl text-sm text-slate-600">Choose your package, then select flight and hotel. Your itinerary and booking summary update automatically.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="group relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-white via-[#fffaf0] to-[#fff3d6] p-4 shadow-sm">
                <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-amber-200/50" />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-inner"><ShieldCheck className="h-5 w-5" /></div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-amber-700">Assurance</p>
                    <p className="text-sm font-bold leading-tight text-slate-900">Best Price Guaranteed</p>
                  </div>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl border border-rose-200 bg-gradient-to-br from-white via-[#fff4f5] to-[#fff4f5] p-4 shadow-sm">
                <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-rose-200/50" />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-xl shadow-inner">☎</div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-[#b51f29]">Expert Help</p>
                    <p className="text-sm font-bold leading-tight text-slate-900">24/7 Travel Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-2xl bg-slate-100 p-1">
                {[
                  { id: "all", label: "All Packages" },
                  { id: "flight", label: "With Flight" },
                  { id: "land", label: "Without Flights" }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => {
                      setPackageTypeFilter(item.id);
                      if (item.id === "land") setCityFilter("all");
                    }}
                    className={cls("rounded-xl px-4 py-2 text-xs font-bold transition", packageTypeFilter === item.id ? "bg-[#b51f29] text-white shadow-sm" : "text-slate-600 hover:bg-white")}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-xs font-semibold text-slate-500">{filteredPackages.length} package options available</p>
            </div>

            {packageTypeFilter !== "land" ? (
              <div className="mt-4">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Departure City</p>
                <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setCityFilter("all")} className={cls("rounded-full border px-3 py-2 text-xs font-bold transition", cityFilter === "all" ? "border-[#b51f29] bg-[#fff4f5] text-[#b51f29]" : "border-slate-200 bg-white text-slate-600 hover:border-[#b51f29]/40")}>All Cities</button>
                {cityOptions.map((city) => (
                  <button type="button" key={city} onClick={() => setCityFilter(city)} className={cls("rounded-full border px-3 py-2 text-xs font-bold transition", cityFilter === city ? "border-[#b51f29] bg-[#fff4f5] text-[#b51f29]" : "border-slate-200 bg-white text-slate-600 hover:border-[#b51f29]/40")}>{city}</button>
                ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredPackages.map((option) => <PackageCard key={option.id} option={option} selected={option.id === pkgId} onClick={() => handlePackageChange(option.id)} />)}</div>
          <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold">What’s Included in <span className="text-[#b51f29]">Standard Package</span></h2>
            <p className="mt-1 text-sm text-slate-500">Complete your package step-by-step by selecting the options below.</p>

            <div className="mt-5 grid gap-4">
              <div ref={flightSectionRef} className="scroll-mt-24 rounded-2xl border border-[#b51f29]/30 p-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#b51f29]">Step 2</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-950">Select Your Flight</h3>
                    <p className="mt-1 text-xs text-slate-500">Choose the most suitable flight option for this package.</p>
                  </div>
                  <span className="rounded-full bg-[#b51f29] px-3 py-1 text-[10px] font-bold text-white">SELECT ONE</span>
                </div>
                <div className="grid gap-3">{availableFlights.map((flight) => <FlightOption key={flight.id} flight={flight} selected={selectedFlight.id === flight.id} onClick={() => handleFlightChange(flight.id)} />)}</div>
              </div>

              <div ref={hotelSectionRef} className="scroll-mt-24 rounded-2xl border border-[#b51f29]/30 p-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#b51f29]">Step 3</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-950">Select Your Hotel</h3>
                    <p className="mt-1 text-xs text-slate-500">Choose hotel and room occupancy for price calculation.</p>
                  </div>
                  <span className="rounded-full bg-[#fff4f5] px-3 py-1 text-[10px] font-bold text-[#b51f29]">4 NIGHTS / 4 DAYS</span>
                </div>
                <div className="grid gap-5 lg:grid-cols-2">{hotels.map((hotel) => <HotelOption key={hotel.id} hotel={hotel} selected={selectedHotel.id === hotel.id} selectedOccupancy={occupancy} onOccupancyChange={setOccupancy} onSelectHotelOnly={() => setHotelId(hotel.id)} onClick={() => { setHotelId(hotel.id); setOccupancy("twin"); }} onViewDetails={setActiveHotelDetails} />)}</div>
              </div>
            </div>
          </div>
          <div className="mt-8"><Itinerary flight={selectedFlight} hotel={selectedHotel} /></div>
          <PackageInclusionsExclusions />
            </>
          )}
        </section>
        <BookingPanel
          pkg={selectedPackage}
          flight={selectedFlight}
          hotel={selectedHotel}
          occupancy={occupancy}
          travellerCount={travellerCount}
          allocationMode={allocationMode}
          setAllocationMode={setAllocationMode}
          allocations={allocations}
          updateAllocation={updateAllocation}
          updateTravellerCount={updateTravellerCount}
          updateTraveller={updateTraveller}
          detailsSubmitted={detailsSubmitted}
          step={step}
          setStep={setStep}
          onShowBookingForm={() => {
            setShowBookingDetailsForm(true);
            window.setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" }), 50);
          }}
          onChangePackageClick={handleChangePackageFromPayment}
        />
      </main>
      <Footer />
      <HotelDetailsModal hotel={activeHotelDetails} onClose={() => setActiveHotelDetails(null)} onSelect={(hotel) => { setHotelId(hotel.id); setOccupancy("twin"); }} />
    </>
  );
}

export default function RedCarpetTradeFairBookingUI() {
  const [page, setPage] = useState("home");

  useEffect(function() {
    window.scrollTo({ top: 0, left: 0 });
  }, [page]);

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-slate-900">
      <Header page={page} setPage={setPage} />
      {page === "home" ? <HomePage setPage={setPage} /> : null}
      {page === "listing" ? <ListingPage setPage={setPage} /> : null}
      {page === "package" ? <PackageDetailPage /> : null}
      {page === "mice" ? <MicePage /> : null}
    </div>
  );
}





