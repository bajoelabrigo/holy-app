import React, { useEffect, useState } from "react";
import UserStats from "../../components/UserStats";
import { Search, Trash2 } from "lucide-react";
import ChangeRole from "../../components/changeRole/changeRole";
import SearchProducts from "../../components/search/Search";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getUsers } from "../../redux/fectures/auth/authSlice";
import { confirmAlert } from "react-confirm-alert";
import {
  FILTER_USERS,
  selectUsers,
} from "../../redux/fectures/auth/filterSlice";
import "react-confirm-alert/src/react-confirm-alert.css";
import ReactPaginate from "react-paginate";
import { shortenText } from "../profile/Profile";
import useRedirectLoggedOutUser from "../../../hooks/useRedirectLoggedOutUser";

const UserList = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  const { users, isLoading, isLoggedIn, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const filteredUsers = useSelector(selectUsers);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const removeUser = async (id) => {
    await dispatch(deleteUser(id));
    dispatch(getUsers());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete This Post",
      message: "Are you sure to do delete this Post?",
      buttons: [
        {
          label: "Delete",
          onClick: () => removeUser(id),
        },
        {
          label: "Cancel",
          onClick: () => alert("Click No"),
        },
      ],
    });
  };

  useEffect(() => {
    dispatch(FILTER_USERS({ users, search }));
  }, [dispatch, users, search]);

  // Begin Pagination
  const itemsPerPage = 5;
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredUsers.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredUsers.length;
    setItemOffset(newOffset);
  };

  // End Pagination

  return (
    <section>
      <UserStats />
      <div>
        <div className="border-collapse w-full text-xl">
          <div className="flex justify-between my-2 space-y-2">
            <span>
              <h3 className="text-3xl font-semibold">All Users</h3>
            </span>
            <span>
              <SearchProducts
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </span>
          </div>
          {/*Table */}
          {!isLoading && users.length === 0 ? (
            <p>No user found...</p>
          ) : (
            <table className="table-zebra w-full">
              <thead className="border-t-4 border-blue-500 border-b-4 text-left">
                <tr>
                  <th>s/n</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Change Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="text-left">
                {currentItems.map((user, index) => {
                  const { _id, name, email, role } = user;
                  return (
                    <tr key={_id}>
                      <td>{itemOffset + index + 1}</td>
                      <td>{shortenText(name, 8)}</td>
                      <td>{email}</td>
                      <td
                        className={` 
                        ${role === "admin" ? "text-primary" : ""} 
                        ${role === "suspended" ? "text-red-500" : ""}
                        ${role === "author" ? "text-info" : ""}
                        `}
                      >
                        {role}
                      </td>
                      <td>
                        <ChangeRole _id={_id} email={email} />
                      </td>
                      <td>
                        <span onClick={() => confirmDelete(_id)}>
                          <Trash2 />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          className="pagination"
          previousLabel="Prev"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="activePage"
        />
      </div>
    </section>
  );
};

export default UserList;
