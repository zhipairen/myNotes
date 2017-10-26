/**
 * Created by gbl17 on 2017/6/16.
 */
/**
 * 千分符格式化
 * @param num
 * @returns
 */
function format1 (num) {
  if( num == null || num == undefined || num == ""  ){
    return "";
  }
  if( isNaN(num)) return num;
  //return (parseFloat(num).toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  return (toFixed(num,2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

function toFixed(number, precision) {
  var b = 1;
  if (isNaN(number)) return number;
  if (number < 0) b = -1;
  var multiplier = Math.pow(10, precision);
  return Math.round(Math.abs(number) * multiplier) / multiplier * b;
}
format1(-900.009);
format1(900.009);
format1(-9002121);