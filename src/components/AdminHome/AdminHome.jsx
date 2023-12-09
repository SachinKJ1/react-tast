import React, { useEffect, useState } from "react";
import "./AdminHome.css"; 
import { Link } from "react-router-dom";
import { useUiContext } from "../../contexts/UiContext";
import axiosInstance from "../../utils/axiosInstance";

function AdminHome() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageArr, setPageArr] = useState([]);
  const [curPage, setCurPage] = useState(1);
  const {
    toNotify,
    spinning,
    toSpin,
    toStopSpin,
    
  } = useUiContext();


  const getAllUsers = async (query = "", page = "") => {
    toSpin();
    try {
      const userData = await axiosInstance().get(`/getAllUser${query}${page}`);

      setUsers(userData.data.users);

      const limitsPerPage = 10;
      const countArr = Array.from({ length: userData.data.count }, (v, i) => i);
      setPageArr((arr) => (arr = []));

      countArr.forEach((val, index) => {
        if (index === 0) setPageArr((arr) => [...arr, 0]);
        if ((index + 1) % limitsPerPage === 0) {
          setPageArr((arr) => [...arr, (index + 1) / limitsPerPage]);
        }
      });
      if (userData.data.count % limitsPerPage === 0)
        setPageArr((arr) => [...arr].pop());
    } catch (error) {
      console.log(error);
      toNotify("red", "Something went wrong");
    } finally {
      toStopSpin();
    }
  };

  async function onDeleteUser(id) {
    let deleteUser = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!deleteUser) return;
    toSpin();
    try {
      await axiosInstance().delete(`/deleteUser/${id}`);
      getAllUsers();
    } catch (error) {
      toNotify("red", "Something went wrong");
      // console.log(error);
    } finally {
      toStopSpin();
    }
  }

  function onSearch(e) {
    e.preventDefault();
    if (!searchQuery) return;
    let query = `?username[$regex]=${searchQuery}&username[$options]=i`;
    getAllUsers(query);
  }

  function paginate(e) {
    const { page } = e.target.dataset;
    // console.log(page);
    let query = `?username[$regex]=${searchQuery}&username[$options]=i`;
    getAllUsers(query, `&page=${page}`);
    setCurPage(() => Number(page));
  }
  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="home-container">
      <div className="home-add-search-container">
        <div>
          <Link to="/create-user" className="add-user-btn">
            Add User
          </Link>
        </div>

        <div>
          <form className="search-form" onSubmit={onSearch}>
            <input
              name="searchQuery"
              className="search-input"
              type="text"
              placeholder="Search Users"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-button">Search </button>
          </form>
        </div>
      </div>
      <hr />
      <div className="users-collection-container">
        <h1 className="heading">User Details</h1>
        <table className="users-table">
          <thead>
            <tr className="table-head-row">
              <th>No</th>
              <th>Username</th>
              <th>Email</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <Link
                    className="user-btns btn-yellow"
                    to={"/update-user/" + user._id}
                  >
                    Update
                  </Link>
                </td>
                <td>
                  <button
                    className="user-btns btn-red"
                    onClick={() => onDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && searchQuery && !spinning && (
          <div className="users-error-msg">No Users found</div>
        )}
        {users.length === 0 && !searchQuery && !spinning && (
          <div className="users-error-msg">Something Went Wrong</div>
        )}
      </div>
      <div className="pagination-container">
        {pageArr?.length > 0 && (
          <nav>
            <ul>
              {pageArr.map((page, i) => (
                <li key={page}>
                  {curPage !== page + 1 && (
                    <button
                      className="paginate-btn"
                      onClick={paginate}
                      data-page={page + 1}
                    >
                      Page {page + 1}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}

export default AdminHome;
