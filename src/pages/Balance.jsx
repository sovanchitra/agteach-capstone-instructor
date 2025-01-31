import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import RecentTransaction from "../components/RecentTransaction";
import Grid from "@mui/material/Grid2";
import PieChartBalance from "../components/balance/PieChartBalance";
import BalanceCard from "../components/balance/BalanceCard";
import TotalCard from "../components/balance/TotalCard";
import QueryHeader from "../components/QueryHeader";
import { useRef, useState } from "react";
import CustomPanel from "../components/balance/CustomPanel";
import CustomTable from "../components/CustomTable";
import emptyProduct from "../assets/spooky-stickers-sweet-franky.png";
import {
  useGetBalanceQuery,
  useGetRecentTransactionsQuery,
  useSearchCourseBalanceQuery,
  useSearchProductBalanceQuery,
} from "../services/api/balanceApi";
function BalancePage() {
  const [selectProductState, setSelectProductState] = useState(0);
  const [selectCourseState, setSelectCourseState] = useState(0);
  const [value, setValue] = useState(0);

  const [searchCourseTerm, setSearchCourseTerm] = useState("");
  const [searchProductTerm, setSearchProductTerm] = useState("");
  const searchCourseRef = useRef();
  const searchProductRef = useRef();

  const { data: balance, isLoading } = useGetBalanceQuery();
  const { data: courses, isLoading: isLoadingCourses } =
    useSearchCourseBalanceQuery({
      name: searchCourseTerm,
      order: selectCourseState,
    });
  const { data: products, isLoading: isLoadingProducts } =
    useSearchProductBalanceQuery({
      name: searchProductTerm,
      order: selectProductState,
    });
  const { data: recentTransactions, isLoading: isLoadingRecentTransaction } =
    useGetRecentTransactionsQuery();

  if (isLoading) {
    return (
      <>
        <Typography>Loading...</Typography>
      </>
    );
  }

  // Get Data to variable
  const productList =
    products?.data.map((product) => {
      return {
        Date: product.date,
        "Product Name": product.productName,
        Name: product.customerName,
        Quantity: product.quantity,
        "Unit Price": `$ ${product.price}`,
        "Total Price": `$ ${product.purchasedPrice}`,
      };
    }) || [];
  const courseList =
    courses?.data.map((course) => {
      return {
        Date: course.date,
        "Course Name": course.courseName,
        Name: course.customerName,
        Price: `$ ${course.salePrice}`,
      };
    }) || [];

  const recentList = recentTransactions?.data || [];
  const balanceData = !isLoading ? balance?.data : { course: 0, product: 0 };

  const { product, course } = balanceData;
  const total = course + product;

  const handleSearchCourse = () => {
    const term = searchCourseRef.current.value;
    setSearchCourseTerm(term); // Update the search term state
  };
  const handleSearchProducts = () => {
    // setIsLoadingSearch(true);
    const term = searchProductRef.current.value;
    setSearchProductTerm(term); // Update the search term state
  };
  return (
    <Stack spacing={5} sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, xl: 8 }}>
          <Box
            pt="30px"
            sx={{
              width: "100%",
              height: "440px",
              borderRadius: 4,
              boxShadow: "0px 10px 33px 0px rgba(5,27,58,0.1)",
            }}
          >
            <Stack direction="row" spacing={2} mx="30px">
              <Box
                pt={"60px"}
                sx={{
                  width: "100%",
                  backgroundColor: "grey.100",
                  borderRadius: 1,
                }}
              >
                <PieChartBalance balance={balanceData} />
              </Box>
              <Stack width={"100%"} direction="column" spacing={2}>
                <BalanceCard balance={balanceData} />
                <TotalCard total={total.toFixed(2)} />
              </Stack>
            </Stack>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, xl: 4 }}>
          {isLoadingRecentTransaction ? (
            <Typography>Loading...</Typography>
          ) : (
            <RecentTransaction data={recentList} />
          )}
        </Grid>
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={(event, newValue) => setValue(newValue)}>
          <Tab label="Course" id="tab-1" />
          <Tab label="Product" id="tab-2" />
        </Tabs>
      </Box>

      <CustomPanel value={value} index={0}>
        <Box>
          <QueryHeader
            searchRef={searchCourseRef}
            handleSearch={handleSearchCourse}
            useSelectState={[selectCourseState, setSelectCourseState]}
            selectData={["Newest", "Oldest"]}
          />
          {isLoadingCourses ? (
            <Typography>Loading...</Typography>
          ) : courseList.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height={"20vh"}
              sx={{ textAlign: "center" }}
            >
              <img
                src={emptyProduct}
                alt="emptyProduct"
                style={{
                  width: "200px",
                  height: "200px",
                  marginBottom: "10px",
                }}
              />
              <Typography variant="bmdr">No course found</Typography>
            </Box>
          ) : (
            <CustomTable data={courseList} isPagination={true} />
          )}
        </Box>
      </CustomPanel>

      <CustomPanel value={value} index={1}>
        <Box>
          <QueryHeader
            searchRef={searchProductRef}
            handleSearch={handleSearchProducts}
            useSelectState={[selectProductState, setSelectProductState]}
            selectData={["Newest", "Oldest"]}
          />
          {isLoadingProducts ? (
            <Typography>Loading...</Typography>
          ) : productList.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height={"20vh"}
              sx={{ textAlign: "center" }}
            >
              <img
                src={emptyProduct}
                alt="emptyProduct"
                style={{
                  width: "200px",
                  height: "200px",
                  marginBottom: "10px",
                }}
              />
              <Typography variant="bmdr">No products found</Typography>
            </Box>
          ) : (
            <CustomTable data={productList} isPagination={true} />
          )}
        </Box>
      </CustomPanel>
    </Stack>
  );
}

export default BalancePage;
