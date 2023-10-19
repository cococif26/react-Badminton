import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Form, Card, Row, Col } from "react-bootstrap";
import FormInput from "../../../../Components/Form/input";
import FormSelect from "../../../../Components/Form/select";
import { ArrowLeft, Trash3 } from "react-bootstrap-icons";
import axios from "../../../../api/axios";
import Swal from "sweetalert2";
import secureLocalStorage from "react-secure-storage";

const UserRoleForm = () => {
    const {id} = useParams();
    // const navigate = useNavigate();
    const [ selectedStatus, setSelectedStatus ] = useState("")
    const [ menuList, setMenuList ] = useState([])
    const [ values, setValues ] = useState({ rolename: "" });
    const [errors, setErrors] = useState([])
    const [menus, setMenus] = useState('')

    const onChange = (e) => { 
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            label: values.rolename,
            menu: [],
            status: selectedStatus,
        };

        for (let i = 0; i < rows.length; i++) {
            if (rows[i].menu !== '') {
                data.menu.push(rows[ i ].menu)
            }
        }

        if (data.menu.length < 1) {
            data.menu = ''
        } else {
            let menuSet = new Set(data.menu);

            if (menuSet.size === data.menu.length) {
                data.menu = JSON.stringify(data.menu);
                if (secureLocalStorage.getItem('id').toString() === id) {
                    secureLocalStorage.setItem('menus', JSON.stringify(data.menu))
                }
            } else {
                data.menu = '86afe930-5c36-11ee-8c99-0242ac120002';
            }
        }

        try {
            await axios.get('/sanctum/csrf-cookie')
            let response
            if (id > 0) {
                response = await axios.put('/api/role/' + id, data)
            } else {
                response = await axios.post('/api/role', data);
            }
            setErrors('');
            Swal.fire({ icon: "success", title: "Success!", html: response.data.message, showConfirmButton: false, allowOutsideClick: false, allowEscapeKey: false, timer: 2000 });
            setTimeout(function () {
                // navigate('/user-management/user-role', { replace: true })
                window.location.href = "/user-management/user-role"
            }, 2000);
        } catch (e) {
            if (e?.response?.status === 422) {
                setErrors(e.response.data.errors)
            } else if (e?.response?.status === 404 || e?.response?.status === 403 || e?.response?.status === 401) {
                Swal.fire({
                    icon: "error", title: "Error!", html: e.response.data.message, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false
                });
            } else {
                Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
            }
        }
    };

    useEffect(() => {
        axios.get('/api/admin-role-menu-list')
        .then(({ data }) => {
            setMenuList(data)
        })
        .catch((e) => {
           Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
        });
        if (id > 0) {
            axios.get('/api/role-edit/' + id)
            .then(({data}) => {
                setValues({ ...values, rolename: data.label })
                setSelectedStatus(data.status)
                setMenus(data.menu)
            })
            .catch((e) => {
                Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false }); 
            });
        }
    },[])

    const TableRows = ({ rows, tableRowRemove, onValUpdate, onCheckUpdate }) => {
        return rows.map((rowsData, index) => {
          const { menu, check } = rowsData;
          return (
            <tr key={index}>
                <td className="text-center">
                    <span className="custom-checkbox">
                        <input type="checkbox" id={`check${index}`} name="check" defaultChecked={check} onChange={(event) => onCheckUpdate(index, event)}/>
                        <label htmlFor={`check${index}`}></label>
                    </span>
                </td>
                <td>
                    <FormSelect
                        name="menu"
                        className="form-select form-select-sm"
                        options={[{value: "", label: " -- select menus --"}, ...menuList]}
                        selected={menu}
                        onChange={(event) => onValUpdate(index, event)}
                    />
                </td>
                <td className="text-center">
                    <a href="#delete" onClick={(e) => tableRowRemove(index)}>
                        <Trash3 className="material-icons" color="dark" title="Delete" />
                    </a>
                </td>
            </tr>
          )
        });
    }

    const dataDefault = { menu:"", check:false };
    const [rows, initRow] = useState([dataDefault]);

    const addRowTable = () => {
        initRow([...rows, dataDefault]);
    };
    const tableRowRemove = (index) => {
        const dataRow = [...rows];
        dataRow.splice(index, 1);
        initRow(dataRow);
    };
    const onValUpdate = (i, event) => {
        const { name, value } = event.target;
        // let newMenus = [...menus]
        // newMenus.push(value)
        // setMenus(newMenus)

        const data = [...rows];
        data[i][name] = value;
        // console.log(rows)
        initRow(data);
    };
    const onCheckUpdate = (i, event) => {
        // console.log(event);
        const { name, checked } = event.target;
        const data = [...rows];
        data[i][name] = checked;
        initRow(data);
    }

  return (
    <>
        <h4 className="mt-5"><b>
            <Link to="/user-management/user-role" className="btnBack"><ArrowLeft/></Link>
            {id? "Edit":"Create"} user role
            </b>
        </h4>
        <Row>
            <Col>
            <Card className="p-3 mt-3" style={{ marginLeft: "-18px" }}>
                <Form onSubmit={handleSubmit}>
                <Row>
                    <Col className="col-12 col-md-6" style={{marginTop:2}}>
                        <Form.Group>
                            <FormInput type="text" label="Rolename" name="rolename" value={values.rolename} onChange={onChange} placeholder="Enter rolename"/>
                            {errors.label &&
                            <span className="text-danger">{errors.label[ 0 ]}</span>}
                        </Form.Group>
                    </Col>
                </Row>
                <div className="table-responsive">
                    <table className="table table-hover mt-3" border={1}>
                        <thead>
                            <tr>
                                <th width={'1%'}></th>
                                <th width={'90%'}>Menu</th>
                                <th width={'9%'} className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <TableRows
                                rows={rows}
                                tableRowRemove={tableRowRemove}
                                onValUpdate={onValUpdate}
                                onCheckUpdate={onCheckUpdate}
                            />
                        </tbody>
                    </table>
                </div>
                {errors.menu &&
                            <span className="text-danger">{errors.menu[ 0 ]}</span>}
                <div className="mb-3"><span className="text-secondary"><small>previous value: {menus}</small></span></div>
                <center>
                    <button type="button" className="btn  btn-sm" onClick={addRowTable} style={{ background: "#B21830", color: "white" }}>
                        Add
                    </button>
                </center>
                <div className="d-flex mt-2">
                    <div className="form-check">
                        <input id="activeId" type="radio" className="form-check-input" name="status" value={selectedStatus} onChange={() => setSelectedStatus('Y')} checked={selectedStatus === 'Y'} />
                        <label htmlFor="activeId">Active</label>
                    </div>
                    &nbsp;&nbsp;&nbsp;
                    <div className="form-check form-check-inline">
                        <input id="inActiveId" type="radio" className="form-check-input" name="status" value={selectedStatus} onChange={() => setSelectedStatus('N')} checked={selectedStatus === 'N'} />
                        <label htmlFor="inActiveId">In active</label>
                    </div>
                </div>
                {errors.status &&
                            <span className="text-danger">{errors.status[ 0 ]}</span>}
                <div className="text-right">
                    <button type="submit" className="btn  btn-sm" style={{ background: "#B21830", color: "white" }}>
                        Save
                    </button>
                </div>
                </Form>
            </Card>
            </Col>
        </Row>
    </>
  );
};

export default UserRoleForm;
