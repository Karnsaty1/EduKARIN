import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import ContentWrapper from './components/ContentWrapper'
import Sign from './components/Sign';
import Dashboard from './components/Dashboard';
import Upload from './components/Upload';
import StreamBoard from './components/StreamBoard'
import JobPortal from './components/JobPortal'
import Prep from './components/Prep';
import PrepDetails from './components/PrepDeatils';
import Log from './components/Log';
import './App.css'

function App() {

  return (
    <>
   
    <ContentWrapper>
      <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/sign' element={<Sign/>}/>
    <Route path='/dashboard' element={<Dashboard/>}/>
    <Route path='/upload' element={<Upload/>}/>
    <Route path='/board' element={<StreamBoard/>}/>
    <Route path='/jobs' element={<JobPortal/>}/>
    <Route path='/prep' element={<Prep/>}/>
    <Route path='/log' element={<Log/>}/>
    <Route path="/prepDetail/:topic" element={<PrepDetails />} />
      </Routes>
    </ContentWrapper>
  
    </>
  );
}

export default App
