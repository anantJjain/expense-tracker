import React,{ useEffect, useState } from 'react';
import moment from 'moment';
import AOS from "aos"; //AOS = animate on scroll which the library used for scroll animations
import "aos/dist/aos.css";
import Marquee from "react-fast-marquee";
import Lottie from 'lottie-react';
import '../../App.css'
import { transactions } from '../../transaction';
import TransactionDetails from '../date-grid/TransactionDetails';
import ToolTip from '../tooltip/ToolTip'
import loader from '../../lottie/lottie.json'
import creditCard from '../../images/credit-card.png'

const days = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat']
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const Home = () => {
  const [ isOpen,setOpen ] = useState(false)
  const [ clickedDate,setClickedDate ] = useState('')
  const [ data,setData ] = useState([])
  const [ transactionsCount,setTransactionsCount ] = useState(0)
  const [ tooltipView,setTooltipView ] = useState(false)
  const [ isLoading,setLoading ] = useState(true)
  const [ yearlyDebit,setYearlyDebit ] = useState(0)
  const [ yearlyCredit,setYearlyCredit ] = useState(0)
  const [ dateTransactions,setDateTransactions ] = useState(Array.from({ length: 53 }, () => Array(7).fill(0)))
  const [ dateBlocks,setDateBlocks ] = useState(Array.from({ length: 53 }, () => Array(7).fill('1')))
  const [ hue,setHue] = useState(Array.from({ length: 53 }, () => Array(7).fill(120)))
  const [ saturation,setSaturation] = useState(Array.from({ length: 53 }, () => Array(7).fill(100)))
  const [ lightness,setLightness] = useState(Array.from({ length: 53 }, () => Array(7).fill(50)))

  useEffect( () => {
    AOS.init({
      once:true  //it is set to true to avoid re-running the AOS effects everytime the component appears in the viewport 
    });
    const daysInYear = moment().isLeapYear() ? 366 : 365;
    const dayAddFactor = moment().isLeapYear() ? 2 : 1; 
    const startDate = moment().add(-moment().day(),'days').add(-daysInYear+dayAddFactor,'days').format('DD-MM-YY')  //calculate the startDate for the first block i.e. cell-00
    const setDateWiseTransactions = async () => {  //this function sets each date block with the number of transactions made on that day
      for (let i=0; i<53; i++){
        for(let j=0; j<7; j++ ){
          const count = transactions.reduce((count, transaction) => count + (moment(transaction.date).format('DD-MM-YY') === moment(startDate,'DD-MM-YY').add((7*i+j),'days').format('DD-MM-YY') ? 1 : 0), 0); //queries the src/transaction.js data for increasing transaction count upon each date match
          dateTransactions[i][j]=count;
        } 
      }
    }
    const setDates = async () => { //this function sets each date block with the corresponding date
      for (let i=0; i<53; i++){
        for(let j=0; j<7; j++ ){
          dateBlocks[i][j]=moment(startDate,'DD-MM-YY').add(7*i+j,'days').format('DD-MM-YY') //generalised equation for the date of each block
        } 
      }
    }
    const setColors = async () => { //this function sets colors(hsl values) for each date block based on the number of transactions made on that day
      for(let i=0;i<53;i++){
        for(let j=0;j<7;j++){
          const normalizedCount =  Math.min(dateTransactions[i][j]*0.1, 1);
          if(normalizedCount===0){  //if there are no transactions on a particular date
            hue[i][j]=0;
            lightness[i][j]=0;
            saturation[i][j]=0;
          }
          else lightness[i][j]=normalizedCount*100
        }
      }
    }
    const calcTotalSpending = async () => { //this function calculates the year round credit and debit amounts
      let sumDebit=0,sumCredit=0;
      for(let i=0;i<transactions.length;i++){
        if(transactions[i].type==="debit") sumDebit+=transactions[i].amount;
        else sumCredit+=transactions[i].amount;
      }
      return [ setYearlyDebit(sumDebit),setYearlyCredit(sumCredit) ];
    }
    const loadData  = async () => {
      await setDates();
      await setDateWiseTransactions();
      await setColors();
      await setTimeout(()=>{
        setLoading(false)   //setting an initial load time for src/transaction to be queried properly
      },6000)
      await calcTotalSpending()
    }
    loadData();
  },[])
  
  return (
    <>
      {
        !isLoading ?  //Conditional rendering - checks if the load time is over,if not renders loader
          <div className='text-white pb-[20px]font-heading'>
            <div className='sm1:hidden md:flex justify-between sm1:pr-2 sm1:pl-2 md:pr-10 md:pl-10 mt-10 border-[0.1px] border-white/40 w-4/5 m-auto p-4 rounded-xl relative z-10'>
              <div>
                <a href="/localhost:3000" alt="" className='sm1:text-xl md:text-xl text-white p-2'>Expense Tracker</a>
              </div>
              <div>
                <a href="/localhost:3000" alt="" target="_blank" className='text-white text-center sm1:text-lg md:text-xl p-2 pr-4'>Github</a>
                <a href="/localhost:3000" alt="" target="_blank" className='text-black text-center sm1:text-lg md:text-xl bg-gradient-to-r from-[#F4B3BF] to-[#C2F2F1] pt-1 pb-1 pl-10 pr-10 rounded-xl'>Docs</a>
              </div>
            </div>
            <div className="blur-3xl bg-gradient-to-b from-red-700/30 to-black absolute top-0 sm1:h-[20vh] md:h-[30vh] lg:h-[50vh] xl:h-[40vh] sm1:w-full lg:w-1/2 z-0"></div>
            <div className='flex w-4/5 m-auto'>
              <div className='sm1:w-full lg:w-1/2'>
                <div 
                  data-aos="fade-up"
                  data-aos-duration="1000"  //duration for the AOS animation to get completed
                  className='sm1:text-[4em] md:text-[6.5em] leading-[0.9em] tracking-tight font-heading m-auto sm1:mt-20 lg:mt-40'
                >
                  Pay & Invest Your Money Better
                </div>
                <div 
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay="300"  //delay that occurs in the AOS effect for this element,this is done to show a staggering effect
                  className='m-auto sm1:text-lg md:text-2xl mt-8 font-light text-white/60 leading-[0.5em]'
                >
                  Start to manage your finances better through this github contribution heatmap transactions expense tracker.
                </div>
                <div className='flex space-x-6 sm1:mt-10 md:mt-20'>
                  <div 
                    data-aos="fade-up"
                    data-aos-delay="500" 
                    data-aos-duration="1000" 
                    className='rounded-xl bg-gradient-to-r from-[#F4B3BF] to-[#C2F2F1] sm1:w-full md:w-1/2 4xl:w-1/4 text-center pt-2 pb-2 pl-10 pr-10 text-black sm1:text-sm md:text-lg'
                  >
                    Get started
                  </div>
                  <div 
                    data-aos="fade-up"
                    data-aos-delay="700"
                    data-aos-duration="1000"
                    className='sm1:hidden md:block rounded-xl md:w-1/2 4xl:w-1/4 text-center pt-2 pb-2 pl-10 pr-10 text-white sm1:text-sm md:text-lg'
                  >
                    Scroll Down
                  </div>
                </div>
              </div>
              <div className='sm1:hidden lg:flex absolute w-1/2 bg-gradient-to-b from-blue-800/20 to-blue-400/20 rounded-bl-[400px] top-0 lg:h-[120vh] 3xl:h-[90vh] left-1/2 flex items-center'>
                <img src={creditCard} alt="" className='lg:w-2/3 3xl:w-1/2 m-auto'></img>
              </div>
            </div>
            <Marquee speed={100} className='sm1:mt-20 md:mt-40'>
              <div className='flex justify-between space-x-40 flex-nowrap'>
                <div className='sm1:text-[1.5em] md:text-[2em] font-light text-white/50'>View</div>
                <div className='sm1:text-[1.5em] md:text-[2em] font-light text-white/50'>Track</div>
                <div className='sm1:text-[1.5em] md:text-[2em] font-light text-white/50'>Analyze</div>
                <div className='sm1:text-[1.5em] md:text-[2em] font-light text-white/50'>Explore</div>
                <div className='sm1:text-[1.5em] md:text-[2em] font-light text-white/50'>Assess</div>
                <div className='sm1:text-[1.5em] md:text-[2em] font-light text-white/50'>Review</div>
                <div className='sm1:text-[1.5em] md:text-[2em] font-light text-white/50'>Navigate</div>
              </div>
            </Marquee>    
            <div className='relative mt-20'>
              {/* SVG for the horizontal line */}
              <svg width="2002" height="24" viewBox="0 0 2002 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12C34.3333 -1.33333 67.6667 -1.33333 101 12C134.333 25.3333 167.667 25.3333 201 12C234.333 -1.33333 267.667 -1.33333 301 12C334.333 25.3333 367.667 25.3333 401 12C434.333 -1.33333 467.667 -1.33333 501 12C534.333 25.3333 567.667 25.3333 601 12C634.333 -1.33333 667.667 -1.33333 701 12C734.333 25.3333 767.667 25.3333 801 12C834.333 -1.33333 867.667 -1.33333 901 12C934.333 25.3333 967.667 25.3333 1001 12C1034.33 -1.33333 1067.67 -1.33333 1101 12C1134.33 25.3333 1167.67 25.3333 1201 12C1234.33 -1.33333 1267.67 -1.33333 1301 12C1334.33 25.3333 1367.67 25.3333 1401 12C1434.33 -1.33333 1467.67 -1.33333 1501 12C1534.33 25.3333 1567.67 25.3333 1601 12C1634.33 -1.33333 1667.67 -1.33333 1701 12C1734.33 25.3333 1767.67 25.3333 1801 12C1834.33 -1.33333 1867.67 -1.33333 1901 12C1934.33 25.3333 1967.67 25.3333 2001 12" stroke="#FEBB96" stroke-width="2"/>
              </svg>
              <div className='sm1:hidden lg:block rounded-full h-24 w-24 bg-[#FEBB96]/50 m-auto absolute -translate-x-1/2 left-1/2 z-20 -mt-16'>
                <div className='text-[4em] font-extralight absolute -translate-x-1/2 left-1/2 z-10 text-white/80 mt-12'>
                  {/* SVG for arrow */}
                  <svg className="z-0" width="20" height="200" viewBox="0 0 16 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.2929 149.707C7.68342 150.098 8.31659 150.098 8.70711 149.707L15.0711 143.343C15.4616 142.953 15.4616 142.319 15.0711 141.929C14.6805 141.538 14.0474 141.538 13.6569 141.929L8.00001 147.586L2.34315 141.929C1.95263 141.538 1.31946 141.538 0.928938 141.929C0.538414 142.319 0.538414 142.953 0.928938 143.343L7.2929 149.707ZM7 4.37114e-08L7.00001 149L9.00001 149L9 -4.37114e-08L7 4.37114e-08Z" fill="#FEBB96"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className='flex sm1:flex-col lg:flex-row w-4/5 m-auto items-center justify-between space-x-2 sm1:mt-20 md:mt-40'>
              <div 
                data-aos="fade-up"
                data-aos-delay="100"
                data-aos-duration="1000"
                className='w-full text-[#FEBB96]/80 text-center flex flex-col'
              >
                <div className='sm1:text-[2.8em] sm2:text-[3em] md:text-[4em] 2xl:text-[5em] leading-[0.9em]'>{ yearlyDebit.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) }</div> 
                {/* Converting the number to currency string using .toLocaleString() method */}
                <div className='text-white/50 sm1:text-[1.2em] md:text-[1.5em]'>Amount debited in last 1 year</div>
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="300"
                data-aos-duration="1000"
                className='w-full text-[#FEBB96]/80 text-center flex flex-col sm1:mt-10 lg:mt-0'
              >
                <div className='sm1:text-[2.8em] sm2:text-[3em] md:text-[4em] 2xl:text-[5em] leading-[0.9em]'>{ yearlyCredit.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) }</div>
                <div className='text-white/50 sm1:text-[1.2em] md:text-[1.5em]'>Amount credited in last 1 year</div>
              </div>
            </div>  
            
            {/* Heatmap */}
            <div 
              data-aos="fade-up"
              data-aos-delay="700"
              data-aos-duration="1000"
              className="mt-8 flexp-10 pb-2 rounded-xl overflow-x-auto overflow-y-hidden whitespace-nowrap relative"
              //overflow-x-auto,nowrap allows the calender div to scroll on smaller devices
            >
              <div className='z-10 absolute m-auto sm1:hidden xl:block left-1/2 -translate-x-1/2 top-0'>
                <ToolTip tooltipView={tooltipView} date={clickedDate} transactionsCount={transactionsCount} />
              </div>
              <div className='p-8 w-fit m-auto rounded-xl mt-10'>
                <div className='flex justify-between ml-12 w-11/12'>
                  {
                    months.map((_,i) => { //showing the months on the heatmap
                      return(
                        <div className='-ml-0' key={i}>{ months[(moment().month()+i)%12] }</div>
                      )
                    })
                  }
                </div>
                <div className='flex'>
                  <div className='w-fit pt-1 text-center'>
                    { 
                      //for the weekdays label 
                      Array.from({ length: 7 }).map((_, weekDayIndex) => (
                        <>
                          <div key={weekDayIndex} className="flex flex-row">
                            <div className={`pr-2 w-[40px] ${ weekDayIndex%2===0 ? 'text-black' : 'text-white' }`}>
                              { days[weekDayIndex] }
                            </div>
                          </div>  
                        </>
                      ))
                    }
                  </div> 
                  <div>
                  { 
                    //for the 53 weeks columns
                    Array.from( { length:7 }).map((_,weekDayIndex) => ( //weekdayIndex : Sunday=0,Monday=1,Tuesday=2.......
                      <div className='flex' key={weekDayIndex}>
                      {
                        Array.from( { length:53 } ).map((_,i) => (  
                          <div 
                            key={weekDayIndex} 
                            data-testid={`date[${i}][${weekDayIndex}]}`}
                            style={{ 
                              backgroundColor:`hsl(${hue[i][weekDayIndex]},${saturation[i][weekDayIndex]}%,${lightness[i][weekDayIndex]}%)`, 
                              visibility:`${i===52 && weekDayIndex>moment().day() ? 'hidden' : 'inline'}`,
                              border:'0.1px rgb(255,255,255,0.25) solid'
                            }}
                            className={`h-[20px] w-[20px] bg-green-500 rounded-sm m-[0.2rem] hover:cursor-pointer text-black`}
                            onClick={ async () => {
                              setOpen(true) 
                              setClickedDate(dateBlocks[i][weekDayIndex])
                              setData( transactions.filter( transaction => {
                                return moment(transaction.date).format('DD-MM-YY') ===  dateBlocks[i][weekDayIndex]
                              }))
                              document.getElementById("transaction-details").scrollIntoView({ behavior:'smooth' })
                            }}
                            onMouseEnter={ () => {
                              setTooltipView(true)
                              setClickedDate(dateBlocks[i][weekDayIndex])
                              setTransactionsCount(dateTransactions[i][weekDayIndex])
                            }} 
                            onMouseLeave={ () => {
                              setTooltipView(false)
                              setClickedDate('') 
                              setTransactionsCount(0)  
                            }}  
                          >
                            {/* <div className='text-white text-center items-center text-xs '>{ i }{weekDayIndex}</div> */}
                          </div>
                        ))
                      }
                      </div>
                    )) 
                  }
                  </div>
                </div>
              </div>
            </div>
            <div className='border-b-2 mt-2 border-green-500/40 m-auto text-center flex justify-center space-x-[6px] w-fit p-1 rounded-0'>
              <div className='text-white text-lg'>Less</div>
              <div className='mt-2 w-[15px] h-[15px] bg-green1 rounded-sm border-[0.1px] border-white/20'></div>
              <div className='mt-2 w-[15px] h-[15px] bg-green2 rounded-sm border-[0.1px] border-white/20'></div>
              <div className='mt-2 w-[15px] h-[15px] bg-green3 rounded-sm border-[0.1px] border-white/20'></div>
              <div className='mt-2 w-[15px] h-[15px] bg-green4 rounded-sm border-[0.1px] border-white/20'></div>
              <div className='text-white text-lg'>More</div>
            </div> 
            
            {/* Transaction details grid */}
            <div className='m-auto mt-20' id="transaction-details">
              {
                isOpen ? <TransactionDetails key={data} data={data} isOpen={isOpen} /> : <div></div>    
              }
            </div>
          </div> : 

          //Loader on initial load time
          <div className='text-4xl text-white text-center h-screen overflow-hidden'>
            <Lottie animationData={loader} className="scale-75"/>
          </div>
      }
    </>
    
  );
}
export default Home;
