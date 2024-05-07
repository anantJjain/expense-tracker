import { useState,useEffect } from 'react';
import moment from 'moment';
import AOS from "aos";
import "aos/dist/aos.css";
import { RxArrowBottomLeft,RxArrowTopRight } from "react-icons/rx";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

//This components is rendered when the user clicks any of the date blocks and show record of transactions on that day
const TransactionDetails = ({ data,isOpen }) => {  
  const [ todayDebit,setTodayDebit ] = useState(0)
  const [ todayCredit,setTodayCredit ] = useState(0)
    
  useEffect( () => {
    AOS.init({ 
      once:true 
    });
    const calcTodaySpending = () => { //calculate a particular day's overall spending including all debit and credit transactions
      let sumDebit=0,sumCredit=0;
      for(let i=0;i<data.length;i++){
        if(data[i].type==="debit") sumDebit+=data[i].amount;
        else sumCredit+=data[i].amount;
      }
      return [ sumDebit,sumCredit ];
    }
    setTodayDebit(calcTodaySpending()[0])
    setTodayCredit(calcTodaySpending()[1])
  },[todayDebit,todayCredit,data] )

  //Options for configuring the chart
  const options = {
    responsive: true,
    maintainAspectRatio:false,
    color:'#fff',
    layout:{
      padding:3
    },
    plugins: {
      legend: {
        display:false,
        position: 'top',
        labels:{
          font:{
            size:20
          }
        }
      },
      title: {
        display: true,
        text: "Transactions made today",
        font:{
          size:24
        },
        color:'white'
      },
    },
    scales:{
      x:{
        ticks:{
          color:'white',
          font:{
            size:15,
          }
        }
      },
      y:{
        ticks:{
          color:'white',
          font:{
            size:15,
          }
        }
      },
    } 
  };

  //Showing Chart's x-axis labels
  const labels = new Array(data.length+1);
  for(let i=0 ; i<data.length+1 ; i++){
    if(i!==0) labels[i] = `Transaction #${i}`
    else labels[i]=0;
  }
  
  const chartValues = new Array(data.length+1);
  chartValues[0]=0;
  for(let i=0 ; i<data.length ; i++){
    if(data[i].type==="debit") chartValues[i+1] = -(data[i].amount);
    else chartValues[i+1] = data[i].amount;
  }

  //chart data for plotting data points
  const chartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: "today's transactions",
        data: chartValues,
        backgroundColor: ['#22c55e' ],
        tension: 1, // Adjust tension for smoother curves
        cubicInterpolationMode: 'monotone' // Use 'default' or 'monotone' for smooth edges
      },
    ],
  };
  
  const calcDateSpending = (data) => { //calculates total spending for today
    let sum=0;
    for(let i=0;i<data.length;i++){
      if(data[i].type==="debit") sum-=data[i].amount;
      else sum+=data[i].amount;
    }
    return sum;
  }
  
  return ( 
    <div>
      {
        data.length===0 && isOpen ? ( //checks whether any transaction on the given date exists or not
          <div className='text-4xl text-white text-center pb-20'>
            <div className='text-[80px] font-bold text-red-500'>Whoops!</div>
            <div className='mt-8'>No transactions made on this date</div>
          </div>
        ) :
        (data.length && isOpen) && (
          <div className='mt-20'>
            <div className='text-center sm1:text-[1.2em] sm2:text-[1.5em] font-extralight italic'>Details of Transactions made on { moment(data[0].date).format('MMMM Do YYYY') }</div>
            <div className='flex sm1:flex-col lg:flex-row justify-center mt-4'>
              <div className='flex flex-col'>
                {/*01. Number of transactions */}
                <div 
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay="100"
                  className='border-[0.1px] border-green-500/50 shadow-green-500 bg-green-800/20 rounded-xl sm1:m-2 sm3:m-4 sm1:p-2 md:p-10'
                >
                  <div className=''>
                    <div className='flex sm1:flex-col'>
                      <div className='text-center sm1:text-xl md:text-3xl xl:text-2xl 2xl:text-3xl ml-2 font-light'>Number of Transactions</div>
                    </div>
                    <div className='text-2xl text-center mt-8'>
                      <span className='text-[4em]  text-green-500'>{data.length}</span>
                      <span className='text-2xl ml-2'>transaction{ data.length>1?'s':''}</span>
                      <div className='text-lg mt-4 text-green-500 italic'>on { moment(data[0].date).format('MMMM Do YYYY') }</div>
                    </div>
                  </div>
                </div>
                {/* Total spending for today */}
                <div 
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay="300"
                  className='border-[0.1px] border-green-500/50 shadow-green-500 bg-green-800/20 rounded-xl sm1:m-2 sm3:m-4 sm1:p-2 md:p-10 flex-grow'
                >
                  <div className=''>
                    <div className='flex sm1:flex-col md:flex-row'>
                      <div className='sm1:text-xl md:text-3xl xl:text-2xl mt-4 ml-2  text-center w-full 2xl:text-3xl'>Total spending for today</div>
                    </div>
                    <div className='flex justify-center items-center mt-4'>
                      <span className={`sm1:text-[2em] sm2:text-[2.5em] md:text-[3em] ${calcDateSpending(data).toFixed(2)<0 ? 'text-red-600' : 'text-green-500'}`}> {/* toFixed(n) - round off to 'n' decimal digits  */}
                        <span className=''>{calcDateSpending(data).toFixed(2)<0 ? '-' : '+'}</span> {/* conditionally adding + or - sign in case of debit and credit respectively  */}
                        <span className=''>&nbsp;{Math.abs(calcDateSpending(data).toFixed(2)).toLocaleString('en-US', { style: 'currency', currency: 'INR' })}&nbsp;</span>
                      </span>
                      <span>
                        {/* showing different arrows for debit and credit  */}
                        { 
                          calcDateSpending(data) < 0 ? 
                            <span className='mt-4 sm1:text-[2em] md:text-[3em]  font-bold text-red-600'><RxArrowTopRight/></span> : 
                            <span className='mt-4 sm1:text-[2em] md:text-[3em]  font-bold text-green-500'><RxArrowBottomLeft/></span> 
                        }
                      </span>
                    </div>
                  </div>
                </div>  
              </div>
              <div className='flex 2xl:flex-row sm1:flex-col'>
                {/* Today transactions */}
                <div 
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay="500"
                  className='bg-black border-[0.1px] border-green-500/50 shadow-green-500 bg-green-800/20 rounded-xl sm1:m-2 sm3:m-4 sm1:p-2 md:p-10'
                >
                  <div className=''>
                    <div className='flex sm1:flex-col md:flex-row'>
                      <div className='text-center sm1:text-xl md:text-3xl xl:text-2xl ml-2 w-full2xl:text-3xl'>Today&apos;s transactions</div>
                    </div>
                    <div>
                      { 
                        data.map((_,i) => (
                          <>
                            <div key={i} className='flex items-center justify-center mt-2'>
                              <span className={`sm1:text-[2em] sm2:text-[2.5em] md:text-[2.6em] ${data[i].type==="debit" ? 'text-red-600' : 'text-green-500'}`}>
                                <span className=''>{data[i].type==="debit" ? '-' : '+'}</span>
                                <span className=''>{data[i].amount.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}&nbsp;&nbsp;</span>
                              </span>
                              { data[i].type === "debit" ? 
                                <span className='mt-2 sm1:text-[2em] md:text-[2.5em]  font-bold text-red-600'><RxArrowTopRight/></span> : 
                                <span className='mt-2 sm1:text-[2em] md:text-[2.5em]  font-bold text-green-500'><RxArrowBottomLeft/></span> 
                              }
                            </div>
                          </>
                        ))
                      }
                    </div>
                  </div>
                </div>
                {/* Line Chart */}
                <div 
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay="700"
                  className='text-4xl border-[0.1px] border-green-500/50 shadow-green-500 bg-green-800/20 rounded-xl sm1:m-2 sm3:m-4 sm1:p-2 md:p-10 sm1:block'
                >
                  <div className='flex justify-center sm1:h-[500px] lg:w-[400px] xl:w-[500px]'>
                    <Line
                      className=''
                      options={options} 
                      data={chartData}   
                    />
                  </div>
                </div>
              </div>
            </div>   
          </div>  
        )  
      }
    </div>
  )
}
export default TransactionDetails