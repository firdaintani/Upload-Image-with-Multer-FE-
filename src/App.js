import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
// import { Z_FIXED } from 'zlib';
import Axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


class App extends Component {
  state={selectedFile : null, products: [], isEdit:false, idEdited : {},selectedFileEdit : null, error : ''}
  onChangeHandler=(event)=>{
    console.log(event.target.files[0])
    this.setState({selectedFile: event.target.files[0]})

  }

  componentDidMount(){
    this.getDataProduct()
  }

  getDataProduct=()=>{
    Axios.get('http://localhost:4000/all')
    .then((res)=>{
      // alert(res.data)
      if(typeof(res.data)==='string'){
        alert(res.data)

      }
      else{
        this.setState({products: res.data})
      }
    
    })
    .catch((err)=>console.log(err))
  
  }


  deleteBtn=(val)=>{
    Axios.delete('http://localhost:4000/delete/'+val.id, {data:val})
    .then((res)=>{
      // alert(res.data)
      if(typeof(res.data)==='string'){
        alert(res.data)

      }
      else{
        alert('delete data berhasil')
        this.setState({products: res.data})
      }
    
    })
    .catch((err)=>console.log(err))
  
  }

  editBtn=(val)=>{
    this.setState({isEdit:true, idEdited:val})

  }

  cancelBtn=()=>{
    this.setState({isEdit:false, idEdited:{}})
  }
  toggle=()=> {
    this.setState(prevState => ({
      isEdit: !prevState.isEdit
    }));
  }

  printDataProduct=()=>{
    var data = this.state.products.map((val, index)=>{
     
        return (
          <tr>
            <td>
              {index+1}
            </td>
            <td>
              {val.product_name}
            </td>
            <td>
              Rp. {val.product_price}
            </td>
            <td>
              <img src={`http://localhost:4000/`+val.product_image} alt='product pict' style={{width:'80px', height:'80px'}}/>
            </td>
            <td>
              <input type='button' className='btn btn-primary' value='Edit' onClick={()=>this.editBtn(val)}/>
              <input type='button' value='Delete' className='btn btn-danger' onClick={()=>this.deleteBtn(val)}/>
              
            </td>
          </tr>
        )
    })
    return data
  }

  valueHandler=()=>{
    // return this.state.selectedFile.
    var value = this.state.selectedFile ? this.state.selectedFile.name : 'Pick a picture'
    return value
  }

  addData=()=>{
    var data = {
      product_name : this.refs.namabarang.value,
      product_price : parseInt(this.refs.harga.value),
       
    }
    var fd = new FormData()
    fd.append('image',this.state.selectedFile, this.state.selectedFile.name)
    fd.append('data',JSON.stringify(data))
    Axios.post ('http://localhost:4000/image', fd)
    .then((res)=>{
      // alert(res.data)
      if(typeof(res.data)==='string'){
        alert(res.data)
      }else if(res.data.error){
        this.setState({error:res.data.msg})
      }
      else{
        alert('tambah data berhasil')
        this.refs.namabarang.value=''
        this.refs.harga.value=''
        this.setState({products: res.data, selectedFile:null})
      }
    
    })
    .catch((err)=>console.log(err))
  }


  saveEdit=()=>{
    var product_name = this.refs.namaEdit.value===''?this.state.idEdited.product_name : this.refs.namaEdit.value
    var product_price = this.refs.hargaEdit.value===''?this.state.idEdited.product_price : this.refs.hargaEdit.value
    
    var newData ={product_name, product_price}
    if(this.state.selectedFileEdit){
      
      // newData.old_path = this.state.idEdited.product_image
      var fd = new FormData()
      
      fd.append('editimage',this.state.selectedFileEdit)
      fd.append('data',JSON.stringify(newData))
      fd.append('imageBefore',this.state.idEdited.product_image)
      // alert(this.state.selectedFileEdit.name)
      Axios.put('http://localhost:4000/editProduct/'+this.state.idEdited.id,fd)
      .then((res)=>{

        if(typeof(res.data)==='string'){
          alert(res.data)
        }
        else{
          alert('edit data berhasil')
          this.setState({products: res.data, isEdit:false, idEdited:{}, selectedFileEdit:null})
        }
      
      })
      .catch((err)=>console.log(err))
    }else{
      Axios.put('http://localhost:4000/editProduct/'+this.state.idEdited.id,newData)
      .then((res)=>{

        if(typeof(res.data)==='string'){
          alert(res.data)
        }
        else{
          alert('edit data berhasil')
          this.setState({products: res.data, isEdit:false, idEdited:{}})
        }
      
      })
      .catch((err)=>console.log(err))
    }
   
  }
  onChangeHandlerEdit=(event)=>{
    console.log(event.target.files[0])
    this.setState({selectedFileEdit: event.target.files[0]})

  }
  valueHandlerEdit=()=>{
    // return this.state.selectedFile.
    var value = this.state.selectedFileEdit ? this.state.selectedFileEdit.name : 'Pick a pict'
    return value
  }

  render() {
    return (
      <div className="container">
       <div className='row mt-4'>
          <div className='col-md-3'>
              <input type='text' placeholder='masukkan nama barang' ref='namabarang' className='form-control' />
          </div>
          <div className='col-md-3'>
          <input type='number' placeholder='masukkan harga' className='form-control' ref='harga'/>

          </div>
          <div className='col-md-3 mt-auto mb-auto' >
          <input type='file' ref='inputfile' style={{display:'none'}} onChange={this.onChangeHandler}/>
          <input type='button' className='btn btn-success' value={this.valueHandler()} style={{width:'100%'}} onClick={()=>this.refs.inputfile.click()}/>

          </div>
          <div className='col-md-3'>
            <input type='button' value='add' className='btn btn-primary' style={{width:'100%'}} onClick={this.addData}/>
          
          
          </div>
          {
            this.state.error ? <p style={{color:'red'}}>{this.state.error}</p> : null
          }
          
       </div>
       <table className='table mt-5'>
          <thead>
            <th>No</th>
            <th>
              Nama Produk
            </th>
            <th>Harga Produk</th>
            <th>Image</th>
            <th>Action</th>
          </thead>
          <tbody>
            {this.printDataProduct()}
          </tbody>
       </table>
       <div>
         {/* modal */}
        { this.state.idEdited ?
         <div>
          <Modal isOpen={this.state.isEdit} toggle={this.cancelBtn} className={this.props.className}>
            <ModalHeader toggle={this.cancelBtn}>Edit Product {this.state.idEdited.product_name}</ModalHeader>
            <ModalBody>
              <div className='row'>
                <div className='col-md-3'>
                  <img src={'http://localhost:4000/'+this.state.idEdited.product_image} width='100%' alt='product pic'></img>
                  <input type='file' onChange={this.onChangeHandlerEdit} style={{display:'none'}} ref='inputEditPict'/>
                  <input type='button' value={this.valueHandlerEdit()} className='btn btn-success mt-2' style={{width:'100%'}} onClick={()=>{this.refs.inputEditPict.click()}}></input>
                </div>
                <div className='col-md-9'>
                  {/* <div></div> */}
                  <input type='text' className='form-control' placeholder={this.state.idEdited.product_name} width='100%' ref='namaEdit'></input>
                  <input type='text' className='mt-3 form-control' placeholder={this.state.idEdited.product_price} width='100%' ref='hargaEdit'></input>

                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.saveEdit}>Save</Button>{' '}
              <Button color="secondary" onClick={this.cancelBtn}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </div>
        : null}
      </div>
      </div>
    );
  }
}

export default App;
