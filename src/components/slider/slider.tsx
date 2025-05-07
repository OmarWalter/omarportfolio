"use client";

import { AnimatedTestimonials } from "./animated-testimonials";

export function Slider() {
  const testimonials = [
    {
      name: "Five Jars",
      quote:"Cooperated with designers to create 10+ clean interfaces and simple,intuitive interactions and experiences. Conducted project concepts and maintain optimal workflow. Work with senior engineer to manage 3 large, complex design projects for corporate clients. Analyzed 20 complex business requirements, designs, and written architecture and technical specifications to design applications.",
      redirect: "https://fivejars.com/",
      pic: "/img/fivejars.png",
    },
    {
      name: "Crypto Game Site",
      quote:"I worked on integrating frontend and smart contracts by using web3js. The platform allows users to earn yield farming rewards by staking their cryptocurrency assets in liquidity pools. I got enough skills for frontend and contracts integration as a senior web3 & blockchain developer, so that I could dive into blockchain development. MyMetaFarm utilizes smart contracts to facilitate secure and trustless transactions between users.",
      redirect: "https://mymetafarm.com",
      pic: "/img/mymetafarm.png",
    },
    {
      name: "Landshare",
      quote:"Served as blockchain full stack developer for the Landshare project, rwa platform built on Binance Smart Chain. Spearheaded the implementation of the platform's landing page using webflow, focusing on creating an engaging and visually appealing user interface that effectively communicated the platform's value proposition implemented others using React/Next Framework. Leveraged the React/Next.js framework to develop and deployed various contracts across the platform, including the Staking vault, NFT game, Swap,and DAO functionalities.",
      redirect: "https://landshare.io/",
      pic: "/img/landshare.png",
    },
    {
      name: "ARIMAX Distribution AG",
      quote:"Demonstrated proficiency in utilizing Python, REST APIs, MS SQL Server, and Power BI to develop a comprehensive data management system. Developed an automated system to scan rooms and retrieve data from Power IQ REST API, which was used to locate PDUs and sensors in each room. Demonstrated proficiency in utilizing blockchain technologies, front-end development frameworks to create a user-friendly and functional dashboard.",
      redirect: "https://www.godaddy.com/forsale/arimax.com",
      pic: "/img/arimax.png",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}