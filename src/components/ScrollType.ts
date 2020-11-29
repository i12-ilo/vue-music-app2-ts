export interface ScrollType{
    $el:HTMLElement,
    disable: ()=>void,
    enable:()=>void,
    refresh:()=>void,
    scrollTo:()=>void,
    scrollToElement:(a?:any,b?:any)=>void,
  }