import React, { useState, useEffect } from "react";

const formatNumberIndian = (num) => {
  return new Intl.NumberFormat("en-IN").format(num);
};

const Test = () => {
  let p = 5000000;
  let HWM=p
  let MFee = 2.5;
  let OthFee = 0.5;
  let bkFee = 0.2;
  const [method, setmethod] = useState(0);

  // Input states for AMC, Performance Fee, etc.
  const [inputs, setInputs] = useState({
    AMC: null,
    Performance_fee: null,
    hurdle_rate: null,
    returns: {
      "Year 1": 10,
      "Year 2": 10,
      "Year 3": 10,
      "Year 4": 10,
      "Year 5": 10,
    },
  });

  // Datas state
  const [datas, setDatas] = useState({});

  const yearList = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];
  let hRate= parseInt(inputs.hurdle_rate)?inputs.hurdle_rate:0;

  // Function to calculate and update the 'datas' based on the inputs
  const calculateDatas = () => {
    let newDatas = {};
    let tp = p; // NAV at the beginning of the period
    let tHWM=HWM

    let OthFee = 0.25;
    let bkFee = 0.25;


    // let MFee = inputs.AMC?inputs.AMC:0;
    let MFee = parseInt(inputs.AMC)?inputs.AMC:0;
    let hRate= parseInt(inputs.hurdle_rate)?inputs.hurdle_rate:0;
    let pFee= parseInt(inputs.Performance_fee)?inputs.Performance_fee:0;
    
    
    for (const year of yearList) {
      let returnPercent=parseInt(inputs.returns[year])?inputs.returns[year]:0;


      let treturn = Math.round((tp * returnPercent) / 100);
      let tgrossval = treturn + tp;
      let hurdle = Math.round((tHWM * hRate) / 100);
      let brokrageFee = Math.round((tgrossval * bkFee) / 100);
      let portfolioAfterBrokrage = tgrossval - brokrageFee;
      let custodyFee = Math.round((tgrossval * OthFee) / 100);
      let portfolioAfterCustody = portfolioAfterBrokrage - custodyFee;
      let managementFee = Math.round((portfolioAfterCustody * MFee) / 100);
      
      // let gstMfee = Math.round(managementFee * 0.18);
      let portfolioafterMfee = portfolioAfterCustody - managementFee;
      
      let perfomanceFee = 0;
      let total_expense = brokrageFee + custodyFee + managementFee
      let netprofrofit_before_perfomance_fee=treturn-total_expense 

      if (netprofrofit_before_perfomance_fee-hurdle> 0) {
        // perfomanceFee = Math.round(netprofrofit_before_perfomance_fee-hurdle*10) ;
        // perfomanceFee=hurdle
        perfomanceFee = Math.round((netprofrofit_before_perfomance_fee-hurdle+tp-tHWM)*pFee/100) ;
      }
      // let gstPerfomanceFee = perfomanceFee * 0.18;
      // let portfolioAfterPfee =
      //   portfolioafterMfee - perfomanceFee ;
      let portfolioAfterPfee =
      tp+netprofrofit_before_perfomance_fee - perfomanceFee ;
      
      let netReturn = ((portfolioAfterPfee - tp) * 100) / tp;


      function get_HWM(){

        if(year=="Year 1"){
          if(portfolioafterMfee<tp){
            return tp
          }
          else{
            return portfolioafterMfee-perfomanceFee
          }
        }

        let result=null;
        if(netReturn>0){
          if(perfomanceFee==0){
            result=tp
          }
          else{
            result=tgrossval-brokrageFee-custodyFee-perfomanceFee-managementFee
          }
        }
        else{
          result=tHWM
        }

        return Math.max(result,tHWM)
      }
      let highWaterMarNext=get_HWM()

      
      newDatas[year] = {
        nav: tp,
        highWaterMarDuring: tHWM,
        ReturnAmount: treturn,
        grossValue: tgrossval,
        brokrageFee: brokrageFee,
        portfolioAfterBrokrage: portfolioAfterBrokrage,
        custodyFee: custodyFee,
        portfolioAfterCustody: portfolioAfterCustody,
        managementFee: managementFee,
        // gstMfee: gstMfee,
        portfolioafterMfee: portfolioafterMfee,
        perfomanceFee: perfomanceFee,
        // gstPerfomanceFee: gstPerfomanceFee,
        portfolioAfterPfee: portfolioAfterPfee,
        netReturn: netReturn,
        highWaterMarNext: highWaterMarNext
      };

      tHWM=highWaterMarNext
      tp = portfolioAfterPfee; // Update tp for the next year
      
    }

    setDatas(newDatas); // Update the 'datas' state
  };

  // Update datas whenever inputs change
  useEffect(() => {
    calculateDatas();
  }, [inputs]);

 

  function handleChange(name, value, year) {
    if (value === null || value === undefined) {
      value = 0;
    }
    if (value!="-" && isNaN(value)) {
      return;
    }
    if (year) {
      setInputs((prevState) => ({
        ...prevState,
        returns: {
          ...prevState.returns,
          [year]: value,
        },
      }));
    } else {
      setInputs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  }

  return (
    <form className=" w- bg-white relative top-20 lg:top-[-100px] text-gray-700 lg:left-0 left-20 rounded-lg p-4 mx-10 border-[2px] overflow-visible">
      <h1 className="text-center lexend-400 w-full">Fees Calculator</h1>
      {/* {hRate} */}
      <p className="text-base text-gray-900 text-center m-4">
        Below fee calculator will help determine how fees are calculated for
        your PMS account at Marathon Trends Advisory Private Limited.
      </p>
      <div
        id="feeStructure"
        className="border-[1px] text-[23px] rounded-lg border-red-300"
      >
        <h1 className="p-4 w-full border-b-[1px] border-red-300">
          Fee Structure
        </h1>
        <div className="flex w-full items-center overflow">
          <div className="flex items-center justify-between p-2 m-2 border-r-[1px]">
            <label className="w-max">AMC :</label>
            <div className="flex items-center">
              <input
                type="text"
              
                // id="quantity-input"
                data-input-counter
                aria-describedby="helper-text-explanation"
                className="w-50px mx-2 text-black h-11 border-[1px] outline-red-400 rounded-lg text-center text-sm  block  py-2 bg-red-700 bg-opacity-10 border-red-200 placeholder-gray-400"
                placeholder="0"
                value={inputs.AMC}
                onChange={(e) => handleChange("AMC", e.target.value)}
                required
              />
              %
              
            </div>
          </div>
          <div className="flex items-center justify-evenly w-max p-10 m-2">
            <label className="w-max">Performance :</label>
            <div className="flex items-center mx-10 mr-20">
              <div>
                <input
                  type="text"
                  // id="quantity-input"
                  data-input-counter
                  aria-describedby="helper-text-explanation"
                  className="w-50px mx-2 text-black h-11 border-[1px] outline-red-400 rounded-lg text-center text-sm block py-2 bg-red-700 bg-opacity-10 border-red-200 placeholder-gray-400"
                  placeholder="0"
                  value={inputs.hurdle_rate}
                  onChange={(e) =>
                    handleChange("hurdle_rate", e.target.value)
                  }
                  required
                />
                <p className="text-sm text-center">Hurdle rate</p>
              </div>
              <span className="relative bottom-3">%</span>
            </div>
            <div className="flex items-center">
              <div>
                <input
                  type="text"
                  // id="quantity-input"
                  data-input-counter
                  aria-describedby="helper-text-explanation"
                  className="w-50px mx-2 text-black h-11 border-[1px] outline-red-400 rounded-lg text-center text-sm block py-2 bg-red-700 bg-opacity-10 border-red-200 placeholder-gray-400"
                  placeholder="0"
                  value={inputs.Performance_fee}
                  onChange={(e) =>
                    handleChange("Performance_fee", e.target.value)
                  }
                  required
                />
                <p className="text-sm text-center">Performance fees</p>
              </div>
              <span className="relative bottom-3">%</span>
            </div>
          </div>
        </div>
      </div>

      <section
        id="illustrations"
        className="border-[1px] text-[23px] rounded-lg border-red-300 mt-5"
      >
        <h1 className="p-4 w-full border-b-[1px] border-red-300">
          Illustration
        </h1>

        <table className=" w-auto border-[1px] border-gray-200 m-[2%]">
          <thead className="font-semibold">
            <tr className="border-b-[1px] border-gray-500 font-semibold">
              <th className="w-[35%] font-semibold text-[18px]">Returns</th>
              {yearList.map((year) => (
                <th key={year} className="font-semibold text-[18px]">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* AT THE BEGINNING OF THE YEAR */}
            <tr>
              <td
                colSpan={6}
                className="te text-center border-b-[1px] text-[17px] font-bold py-2"
              >
                AT THE BEGINNING OF THE YEAR
              </td>
            </tr>
            <tr className="text-[14px] font-semibold border-b-[1px]">
              <td className="border-l-[0px] pl-2">
                NAV at beginning of period … (A)
              </td>
              {yearList.map((year) => (
                <td key={year} className="border-l-[1px] text-center">
                  {formatNumberIndian(datas[year]?.nav).toLocaleString()}
                </td>
              ))}
            </tr>
            <tr className="text-[14px] font-semibold border-b-[1px]">
              <td className="border-l-[0px] pl-2">
                High Water Mark (HWM) … (B)
              </td>
              {yearList.map((year) => (
                <td key={year} className="border-l-[1px] text-center">
                  {formatNumberIndian(
                    datas[year]?.highWaterMarDuring
                  ).toLocaleString()}
                </td>
              ))}
            </tr>

            {/* DURING THE YEAR */}
            <tr>
              <td
                colSpan={6}
                className="te text-center border-b-[1px] border-t-[1px] border-t-black text-[17px] font-bold py-2"
              >
                DURING THE YEAR
              </td>
            </tr>

            <tr className="text-[14px] font-semibold border-b-[1px]">
              <td className="border-l-[0px] pl-2">Return during the year</td>
              {yearList.map((year) => (
                <td key={year} className="border-l-[1px] w-max">
                  <div className="flex items-center justify-center">
                    <input
                      type="text"
                      className="w-14 m-2 p-2 text-black h-11 border-[1px] outline-red-400 rounded-lg text-center text-sm bg-red-700 bg-opacity-10 border-red-200"
                      placeholder="0"
                      value={inputs.returns[year]}
                      onChange={(e) =>
                        handleChange(null, e.target.value, year)
                      }
                      required
                    />
                    %
                  </div>
                </td>
              ))}
            </tr>

            <tr className="text-[14px] font-semibold border-b-[1px]">
              <td className="border-l-[0px] pl-2">
                Return amount before PMS fees (C)
              </td>
              {yearList.map((year) => (
                <td key={year} className="border-l-[1px] text-center">
                  {formatNumberIndian(
                    datas[year]?.ReturnAmount
                  ).toLocaleString()}
                </td>
              ))}
            </tr>

            <tr className="text-[14px] font-semibold border-b-[1px]">
              <td className="border-l-[0px] pl-2">Gross Value (A + C) … (D)</td>
              {yearList.map((year) => (
                <td key={year} className="border-l-[1px] text-center">
                  {formatNumberIndian(datas[year]?.grossValue).toLocaleString()}
                </td>
              ))}
            </tr>
            {/* ---------------------------------------s3------------------------------------------- */}
            <tr className="text-[14px] font-semibold border-b-[1px] 	leading-6">
              <td className="border-l-[0px] p-2">
                Less : Contract Note Charges (Brokerage at 0.25%, STT, Stamp
                Duty, GST, etc.)
                <p className=" text-gray-400 text-[12px] leading-5">
                  This head is charged as per actuals on Contract Notes and
                  assumed here at 1% on average of beginning and ending AUM, for
                  illustration purposes only.
                </p>
              </td>
              {yearList.map((year) => (
                <td key={year} className="border-l-[1px] text-center">
                  {formatNumberIndian(
                    datas[year]?.brokrageFee
                  )?.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr className="text-[14px] font-semibold border-b-[1px] 	leading-6 border-b-black">
              <td className="border-l-[0px] p-2">
                Gross Portfolio Value at end of the year
                <p className=" text-gray-400 text-[12px] leading-5">
                  AFTER contract note charges, BEFORE Operating Expenses
                </p>
              </td>
              {yearList.map((year) => (
                <td key={year} className="border-l-[1px] text-center">
                  {formatNumberIndian(
                    datas[year]?.portfolioAfterBrokrage
                  )?.toLocaleString()}
                </td>
              ))}
            </tr>
            {/* ---------------------------------------s3------------------------------------------- */}
            <tr className="text-[14px] font-semibold border-b-[1px] 	leading-6">
              <td className="border-l-[0px] p-2">
                Less: Operating Expenses i.e. Non-Contract Note Charges @0.25%
                (FA, Custody, Legal, Audit, etc.)
                <p className=" text-gray-400 text-[12px] leading-5">
                  The max charge under this head is 0.50% of AUM and assumed on
                  average of beginning and ending AUM, for illustration purposes
                  only.
                </p>
              </td>
              {yearList.map((year) => (
                <td key={year} className="border-l-[1px] text-center">
                  {formatNumberIndian(
                    datas[year]?.custodyFee
                  )?.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr className="text-[14px] font-semibold border-b-[1px] 	leading-6 border-b-black">
              <td className="border-l-[0px] p-2">
                Gross Value of the Portfolio at the end of the year
                <p className=" text-gray-400 text-[12px] leading-5">
                  AFTER Contract Note Charges, AFTER Operating Expenses
                </p>
              </td>
              {yearList.map((year) => (
                <td key={year} className="border-l-[1px] text-center">
                  {formatNumberIndian(
                    datas[year]?.portfolioAfterCustody
                  )?.toLocaleString()}
                </td>
              ))}
            </tr>
            {/* ---------------------------------------s4------------------------------------------- */}
            <tr className="text-[14px] font-semibold border-b-[1px] 	leading-6 ">
              <td className="border-l-[0px] p-2">
                Less : Fixed Management Fees (@ {inputs.AMC}%)
              </td>
              {yearList.map((year) => (
                <td key={year} className="border-l-[1px] text-center">
                  {formatNumberIndian(
                    datas[year]?.managementFee
                  )?.toLocaleString()}
                </td>
              ))}
            </tr>
            {/* <tr className="text-[14px] font-semibold border-b-[1px] 	leading-6 ">
              <td className="border-l-[0px] p-2">
                Less : GST on Fixed Management Fees (@ 18% of Fixed Management
                Fees )
              </td>
              {yearList.map((year) => (
                <td key={year} className="border-l-[1px] text-center">
                  {formatNumberIndian(datas[year])?.gstMfee?.toLocaleString()}
                </td>
              ))}
            </tr> */}
            <tr className="text-[14px] font-semibold border-b-[1px] border-b-black	leading-6 ">
              <td className="border-l-[0px] p-2">
                Portfolio Value AFTER fixed Management Fees
                <p className=" text-gray-400 text-[12px] leading-5">
                  BEFORE Performance Fees
                </p>
              </td>
              {yearList.map((year) => (
                <td key={year} className="border-l-[1px] text-center">
                  {formatNumberIndian(
                    datas[year]?.portfolioafterMfee
                  )?.toLocaleString()}
                </td>
              ))}
            </tr>

            {/* ---------------------------------------s4------------------------------------------- */}
            <tr className="text-[14px] font-semibold border-b-[1px] 	leading-6 ">
              <td className="border-l-[0px] p-2">
                Less : Performance Fees (@ {inputs.Performance_fee}% after
                hurdle rate of {inputs.hurdle_rate}%)
              </td>
              {yearList.map((year) => (
                <td key={year} className="border-l-[1px] text-center">
                  {formatNumberIndian(
                    datas[year]?.perfomanceFee
                  )?.toLocaleString()}
                </td>
              ))}
            </tr>
            {/* <tr className="text-[14px] font-semibold border-b-[1px] 	leading-6 ">
              <td className="border-l-[0px] p-2">
                Less : GST on Performance fees (@ 18% of Performance Fees )
              </td>
              {yearList.map((year) => (
                <td key={year} className="border-l-[1px] text-center">
                  {formatNumberIndian(
                    datas[year]?.gstPerfomanceFee
                  )?.toLocaleString()}
                </td>
              ))}
            </tr> */}
            <tr className="text-[14px] font-semibold border-b-[1px] 	leading-6 ">
              <td className="border-l-[0px] p-2">
                Net Value of the Portfolio at end of the year{" "}
              </td>
              {yearList.map((year) => (
                <td key={year} className="border-l-[1px] text-center">
                  {formatNumberIndian(
                    datas[year]?.portfolioAfterPfee
                  )?.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr className="text-[14px] font-semibold border-b-[1px] 	leading-6 border-b-black">
              <td className="border-l-[0px] p-2">Net return to client </td>
              {yearList.map((year) => (
                <td key={year} className="border-l-[1px] text-center">
                  {/* {formatNumberIndian(datas[year]?.netReturn)?.toLocaleString()} */}
                  
                  {(Math.round(formatNumberIndian(datas[year]?.netReturn) * 100) / 100).toLocaleString()}

                  %
                </td>
              ))}
            </tr>
            {/* ---------------------------------------s5------------------------------------------- */}
            <tr className="text-[14px] font-semibold border-b-[0px] 	leading-6">
              <td className="border-l-[0px] p-2">
                <p>Accounts closed here for the year.</p>

                <i className=" text-gray-400 text-[12px] leading-5">
                  Think of it as if PMS account is closed / redeemed and
                  reopened immediately.
                  <u>
                    But HWM is carried forward in reality so any previous losses
                    are carried ahead before performance fees are billed.
                  </u>
                </i>
              </td>
              {yearList.map((year) => (
                <td key={year} className="border-l-[1px] text-center">
                  {/* {datas[year]?.portfolioAfterPfee?.toLocaleString()} */}
                </td>
              ))}
            </tr>
            <tr className="text-[14px] font-semibold border-b-[1px] 	leading-6">
              <td className="border-l-[0px] p-2">
                <p>Beginning NAV for next year … (A for next year) </p>
              </td>
              {yearList.map((year) => (
                <td key={year} className="border-l-[1px] text-center">
                  {formatNumberIndian(
                    datas[year]?.portfolioAfterPfee
                  )?.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr className="text-[14px] font-semibold border-b-[1px] 	leading-6">
              <td className="border-l-[0px] p-2">
                <p>High Water Mark (HWM) for next year … (B for next year) </p>
              </td>
              {yearList.map((year) => (
                <td key={year} className="border-l-[1px] text-center">
                  {formatNumberIndian(
                    datas[year]?.highWaterMarNext
                  )?.toLocaleString()}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </section>
      <div className="text-[14px] p-4 leading-5 font-semibold">
        <h2>
          <u>Notes</u>
        </h2>
        <i className="text-gray-400">
          1)This is a simplified example assuming no cash inflow/outflow during
          the year. Actual fees will vary based on actual numbers.
        </i>
      </div>
    </form>
  );
};

export default Test;
