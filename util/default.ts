const defaultAvatars = [
  {
    id: 1,
    url: "https://res.cloudinary.com/dwgsvtusk/image/upload/v1763827547/5_vwcx3o.png",
  },
  {
    id: 2,
    url: "https://res.cloudinary.com/dwgsvtusk/image/upload/v1763827547/4_kludaj.png",
  },
  {
    id: 3,
    url: "https://res.cloudinary.com/dwgsvtusk/image/upload/v1763827547/3_lejva1.png",
  },
  {
    id: 4,
    url: "https://res.cloudinary.com/dwgsvtusk/image/upload/v1763827546/1_ob8uod.png",
  },
  {
    id: 5,
    url: "https://res.cloudinary.com/dwgsvtusk/image/upload/v1763827546/2_groqrp.png",
  },
];

const defaultStoreAvatars = [
  {
    id: 1,
    url: "https://res.cloudinary.com/dwgsvtusk/image/upload/v1763827605/icons-1763827386400_hagkcx.png",
  },
  {
    id: 2,
    url: "https://res.cloudinary.com/dwgsvtusk/image/upload/v1763827604/icons-1763827382846_oqec6q.png",
  },
  {
    id: 3,
    url: "https://res.cloudinary.com/dwgsvtusk/image/upload/v1763827602/icons-1763827377518_y3hch6.png",
  },
  {
    id: 4,
    url: "https://res.cloudinary.com/dwgsvtusk/image/upload/v1763827601/icons-1763827371526_h193fk.png",
  },
  {
    id: 5,
    url: "https://res.cloudinary.com/dwgsvtusk/image/upload/v1763827600/icons-1763827360012_jesmf4.png",
  },
  {
    id: 6,
    url: "https://res.cloudinary.com/dwgsvtusk/image/upload/v1763827600/icons-1763827355019_qbakdf.png",
  },
  {
    id: 7,
    url: "https://res.cloudinary.com/dwgsvtusk/image/upload/v1763827599/icons-1763827348647_frq5jg.png",
  },
  {
    id: 8,
    url: "https://res.cloudinary.com/dwgsvtusk/image/upload/v1763827598/icons-1763827340561_tu0jnc.png",
  },
  {
    id: 9,
    url: "https://res.cloudinary.com/dwgsvtusk/image/upload/v1763827597/icons-1763827331546_vbls1m.png",
  },
];

function pickRandom<T>(list: T[]): T {
  const i = Math.floor(Math.random() * list.length);
  return list[i];
}

export { defaultAvatars, defaultStoreAvatars, pickRandom };
