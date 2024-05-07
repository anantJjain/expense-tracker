import React from "react"
import moment from "moment"

//This component represents a tooltip that appears whenever the user hovers over a particular date
const ToolTip = ({ transactionsCount,tooltipView,date }) => {
  return (
    <>
      {
        ( tooltipView && date!=='') && (  //Checks if the tooltipView = true and date is set
          <div className='flex flex-col'>
            <div className='bg-black p-2 pl-4 pr-4 rounded-xl text-white border-2 border-white/80'> 
              { transactionsCount===0 ? 'No' : transactionsCount } transactions on {moment(date,'DD-MM-YYYY').format('LL') }  
            </div>
          </div>
        )
      }    
    </>
  )
}
export default ToolTip