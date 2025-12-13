import React from 'react'
import Hero from '../../Component/Home/Hero'
import FeaturedClubs from '../../Component/Home/FeaturedClubs'
import HowItWorks from '../../Component/Home/HowItWorks'
import WhyJoin from '../../Component/Home/WhyJoin'
import Categories from '../../Component/Home/Categories'
import CallToAction from '../../Component/Home/CallToAction'

const Home = () => {
  return (
    <>
        <Hero/>
        <FeaturedClubs/>
        <HowItWorks/>
        <WhyJoin/>
        <Categories/>
        <CallToAction/>
    </>
  )
}

export default Home