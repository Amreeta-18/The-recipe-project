import React, {useState, useContext} from 'react'
import {Tabs, TabList, Tab, TabPanels, TabPanel} from '@reach/tabs'
import PersonalSetting from '../components/PersonalSetting'
import PersonalFavorite from '../components/PersonalFavorite'
import PersonalIngredients from '../components/PersonalIngredients'
import {UserInfo} from '../components/UserContext'

function PersonalPage() {
  const [tabIndex, setTabIndex] = useState(0)
  const userInfo = useContext(UserInfo)

  return (
    <div className='page-container'>
      {/* the CSS of tabs is in frontend/src/styles/tabs.css */}
      {/* corresponding CSS name can refer to here https://reach.tech/tabs */}
      <p>Hi, {userInfo.info.userName}!</p>
      <Tabs
        onChange={(index) => setTabIndex(index)}
      >
        <TabList>
          <Tab>Personal</Tab>
          <Tab>Favorite</Tab>
          <Tab>Allergen</Tab>
        </TabList>
        <TabPanels style={{ padding: 20 }}>
          <TabPanel><PersonalSetting userId={userInfo.info.id}/></TabPanel>
          <TabPanel><PersonalFavorite userId={userInfo.info.id}/></TabPanel>
          <TabPanel><PersonalIngredients userId={userInfo.info.id}/></TabPanel>
        </TabPanels>
      </Tabs>
      <style jsx='true'>
          {`
          .page-container {
            width: 100vw;
            height: calc(100vh - 190px);
          `}
      </style>
    </div>
  )   
}

export default PersonalPage
