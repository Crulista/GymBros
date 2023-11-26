document.addEventListener("DOMContentLoaded", function() {
    try {
      var compTable = document.querySelector(".tableContainer");
      if (compTable) {
        var tableBodyRowData = compTable.querySelectorAll(".tableBodyRow td, .tableBodyRow th");
        var caption = compTable.querySelector("caption");
        var captionHeight = caption ? caption.offsetHeight : 0;
        var compTableBody = compTable.querySelector("tbody");
        var compTableHead = compTable.querySelector("thead");
        var columnHeaders = compTable.querySelectorAll(".columnHeader");
        var columnHeadersRow = compTableHead.querySelector(".columnHeaders");
        var columnHeadersNotEmpty = compTableHead.querySelectorAll(".columnHeader:not(.emptyCell)");
        var horizontalScroller = compTable.querySelector(".horizontal-scroller");
        var horizontalScrollerContent = horizontalScroller.querySelector(".horizontal-scroller-content");
        var originalTablePosition = "";
  
        function checkTableOffset() {
          var compTableRect = compTable.getBoundingClientRect();
          var compTableHeadRect = compTableHead.getBoundingClientRect();
          var compTableBodyRect = compTableBody.getBoundingClientRect();
          var compTableHeadRowRect = columnHeadersRow.getBoundingClientRect();
          horizontalScroller.style.left = compTableRect.left + "px";
          horizontalScroller.style.width = compTableRect.width + "px";
          horizontalScrollerContent.style.width = compTable.scrollWidth + "px";
          if (compTableRect.top <= 0 && compTableRect.height-50 > window.innerHeight) {
            calculateColumnHeaderWidthsAndPos(compTableRect, compTableHeadRect, compTableBodyRect);
          } else if (compTableBodyRect.top > compTableHeadRect.bottom) {
            resetTable();
          }
  
          if (compTableRect.bottom <= window.innerHeight || compTableRect.top > window.innerHeight) {
            horizontalScroller.style.visibility = "hidden";
          } else if (compTableRect.top <= window.innerHeight && compTable.clientWidth < compTable.scrollWidth) {
            horizontalScroller.style.visibility = "visible";
          }
  
          if (compTableRect.bottom <= compTableHeadRect.bottom && !Array.from(compTableHead.classList).includes("atBottom")) {
            compTableHead.classList.add("atBottom");
          } else if (compTableHeadRect.top >= 0) {
            compTableHead.classList.remove("atBottom");
          }
        }
  
        function scrollColumnHeader(compTable) {
          compTableHead.scrollLeft = compTable.scrollLeft;
        }
  
        function setColWidths(compTableRect) {
          compTableHead.style.width = compTableRect.width + "px";
          compTableHead.style.left = compTableRect.left + "px";
          for (let i = 0; i < columnHeaders.length; i++) {
            var tableBodyRowDataRect = tableBodyRowData[i].getBoundingClientRect();
            if (Array.from(compTableHead.classList).includes("stickyHeader")) {
              columnHeaders[i].style.minWidth = getComputedStyle(tableBodyRowData[i]).width;
            } else {
              columnHeaders[i].style.minWidth = "initial";
            }
          }
        }
  
        function calculateColumnHeaderWidthsAndPos(compTableRect, compTableHeadRect, compTableBodyRect) {
          compTableHead.classList.add("stickyHeader");
          scrollColumnHeader(compTable);
          setColWidths(compTableRect);
  
          var xMatrix = parseFloat(getComputedStyle(compTableBody).transform.substring(getComputedStyle(compTableBody).transform.indexOf("(")+1, getComputedStyle(compTableBody).transform.lastIndexOf(")")).split(",")[5]);
          if ((xMatrix == 0 || getComputedStyle(compTableBody).transform == 'none')) {
            compTableBody.style.transform = "translateY(" + (compTableHead.offsetHeight - captionHeight) + "px)";
            compTable.style.paddingBottom = (compTableHead.offsetHeight - captionHeight) + "px";
          }
        }
  
        function resetTable() {
          compTableHead.classList.remove("stickyHeader");
          compTableBody.style.transform = "translateY(0px)";
          compTable.style.paddingBottom = "0px";
        }
  
        window.addEventListener("scroll", function() {
          checkTableOffset();
        });
  
        window.addEventListener("resize", function () {
          resetTable();
          checkTableOffset();
        });
  
        compTable.addEventListener("scroll", function(e) {
          if (Array.from(compTableHead.classList).includes("stickyHeader") && !Array.from(compTableHead.classList).includes("atBottom")) {
            scrollColumnHeader(e.target);
          }
          horizontalScroller.scrollLeft = e.target.scrollLeft;
        });
  
        horizontalScroller.addEventListener("scroll", function(e) {
          if (Array.from(compTableHead.classList).includes("stickyHeader") && !Array.from(compTableHead.classList).includes("atBottom")) {
            scrollColumnHeader(e.target);
          }
          compTable.scrollLeft = e.target.scrollLeft;
        });
  
        compTableHead.addEventListener("scroll", function(e) {
          horizontalScroller.scrollLeft = e.target.scrollLeft;
          compTable.scrollLeft = e.target.scrollLeft;
        });
  
        var compTableRect = compTable.getBoundingClientRect();
        setColWidths(compTableRect);
        checkTableOffset();
      }
    } catch(error) {
      console.log(error);
    }
  });