<template>
 <div class="dashboard grey--lighten-1">
<v-dialog v-model="stockdialog" max-width="500px">
      <v-card>
        <v-toolbar dark color="primary" class="elevation-0">
          <v-toolbar-title>Issue Stock</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn round outline color="blue lighten-1" flat @click.native="close">
            Cancel
            <v-icon right dark>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form ref="updateform" v-model="valid" lazy-validation>
          <v-card-text>   <v-toolbar-title>Quantity Requested: {{requestIssue.quantity}} </v-toolbar-title>
            <v-container grid-list-md>

              <v-layout wrap>
               
                    

                 
              <v-flex xs6 sm6 md6>
                    <v-text-field
                      outline
                      readonly
                      v-model="requestItem.stock_id"
                      :rules="[v => !!v || 'Stock ID is Required']"
                      label="Stock ID">
                    </v-text-field>
                  </v-flex>
       
                  <v-flex xs6 sm6 md6>
                    <v-text-field
                      outline
                      
                      v-model="requestItem.quantity"
                      :rules="[v => !!v || 'Quantity Signed Out is Required']"
                      label="Quantity Available:">
                    </v-text-field>
                  </v-flex>
                                       <v-flex xs6 sm6 md6>
                    <v-text-field
                      outline
                      v-model="requestItem.comment"
                      :rules="[v => !!v || 'Remarks is Required']"
                      label="Comment">
                    </v-text-field>
                  </v-flex>
              </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn round outline xs12 sm6 color="blue darken-1" :disabled="!valid" @click.native="saveIssueStock" :loading="loading">
              Save <v-icon right dark>cloud_upload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  <v-dialog v-model="receiveDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click.native="receiveDialog = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark flat @click.native="addStock = true">Add new Stock</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-data-table
          :headers="stockheaders"
          :items="stockDetails"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
       
          <td>{{ props.item.lot_no }}</td>
            <td class="text-xs-left">{{ props.item.batch_no }}</td>
            <td class="text-xs-left">{{ props.item.manufacturer }}</td>
            <td class="text-xs-left">{{ props.item.quantity_supplied }}</td>
            <td class="text-xs-left">{{ props.item.quantity_issued}}</td>
            <td class="text-xs-left">{{stockItem.quantity_stock}}</td>
            <td class="text-xs-left">{{ props.item.expiry_date }}</td>
            <td class="justify-left layout px-0">
              <v-btn
                outline
                small
                title="Edit"
                color="teal"
                flat
                @click=" issueItem(props.item)">
                Edit
                <v-icon right dark>edit</v-icon>
              </v-btn>
              <v-btn
                outline
                small
                title="Edit"
                color="warning"
                flat
                @click="issueItem(props.item)">
                Issue Stock
                <v-icon right dark>done_all</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
</v-card>
</v-dialog>

   <v-container grid-list-xl>



    <v-layout wrap>
      <v-flex  sm6
      xs12
      md6
      lg3 style="padding:10px;">
      <v-card color="blue-grey darken-2" class="white--text">
        <v-layout>
          <v-flex xs5>
            <v-img
            src="https://image.flaticon.com/icons/svg/33/33308.svg"
            height="125px"
            contain
            ></v-img>
          </v-flex>
       
<v-flex xs7>
  <v-card-title primary-title>
    <div>
      <div class="headline">Users</div>
      <div>{{users_count}}</div>
      <div></div>
    </div>
  </v-card-title>
</v-flex>
</v-layout>
<v-divider light></v-divider>
<v-card-actions class="pa-3">
 <v-btn to="/admin/users" flat color="white">View More</v-btn>
</v-card-actions>
</v-card>
</v-flex>

<v-flex  sm6
xs12
md6
lg3 style="padding:10px;">
<v-card color="cyan darken-2" class="white--text">
  <v-layout>
    <v-flex xs5>
      <v-img
      src="https://image.flaticon.com/icons/svg/66/66276.svg"
      height="125px"
      contain
      ></v-img>
    </v-flex>
    <v-flex xs7>
      <v-card-title primary-title>
        <div>
          <div class="headline">Complete Requests</div>
          <div>{{complete}}</div>
          <div></div>
        </div>
      </v-card-title>
    </v-flex>
  </v-layout>
  <v-divider light></v-divider>
  <v-card-actions class="pa-3">
   <v-btn to="/admin/requests" flat color="white">View More</v-btn>
 </v-card-actions>
</v-card>
</v-flex>
<v-flex  sm6
xs12
md6
lg3 style="padding:10px;">
<v-card color=" orange darken-4" class="white--text">
  <v-layout>
    <v-flex xs5>
      <v-img
      src="https://image.flaticon.com/icons/svg/1/1560.svg"
      height="125px"
      contain
      ></v-img>
    </v-flex>
    <v-flex xs7>
      <v-card-title primary-title>
        <div>
          <div class="headline">Pending Requests</div>
          <div>{{pending}}</div>

        </div>
      </v-card-title>
    </v-flex>
  </v-layout>
  <v-divider light></v-divider>
  <v-card-actions class="pa-3">
   <v-btn to="/admin/requests" flat color="white">View More</v-btn>
 </v-card-actions>
</v-card>
</v-flex>


<v-flex  sm6
xs12
md6
lg3 style="padding:10px;">
<v-card color=" red darken-4" class="white--text">
  <v-layout>
    <v-flex xs5>
      <v-img
      src="stop.png"
      height="125px"
      contain
      ></v-img>
    </v-flex>
    <v-flex xs7>
      <v-card-title primary-title>
        <div>
          <div class="headline">Rejected Requests</div>
          <div>{{rejected}}</div>

        </div>
      </v-card-title>
    </v-flex>
  </v-layout>
  <v-divider light></v-divider>
  <v-card-actions class="pa-3">
   <v-btn to="/admin/requests" flat color="white">View More</v-btn>
 </v-card-actions>
</v-card>
</v-flex>
<v-flex  sm6
xs12
md6
lg3 style="padding:10px;">
<v-card color="green" class="white--text">
  <v-layout row>
    <v-flex xs7>
      <v-card-title primary-title>
        <div>
          <div class="headline">Health Facilities</div>
          <div>{{facilities}}</div>

        </div>
      </v-card-title>
    </v-flex>
    <v-flex xs5>
      <v-img
      src="https://image.flaticon.com/icons/png/512/1546/1546074.png"
      height="125px"
      contain
      ></v-img>
    </v-flex>
  </v-layout>
  <v-divider light></v-divider>
  <v-card-actions class="pa-3">
    <v-btn to="/admin/facilities" flat color="white">View More</v-btn>

  </v-card-actions>
</v-card>
</v-flex>

<v-flex  sm6
xs12
md6
lg3 style="padding:10px;">
<v-card color="orange" class="white--text">
  <v-layout row>
    <v-flex xs7>
      <v-card-title primary-title>
        <div>
          <div class="headline">Pharmacist</div>
          <div>{{pharmacist}}</div>

        </div>
      </v-card-title>
    </v-flex>
    <v-flex xs5>
      <v-img
      src="https://image.flaticon.com/icons/png/512/2051/2051579.png"
      height="125px"
      contain
      ></v-img>
    </v-flex>
  </v-layout>
  <v-divider light></v-divider>
  <v-card-actions class="pa-3">
    <v-btn to="/admin/users" flat color="white">View More</v-btn>

  </v-card-actions>
</v-card>
</v-flex>
<v-flex  sm6
xs12
md6
lg3 style="padding:10px;">
<v-card color="grey" class="white--text">
  <v-layout row>
    <v-flex xs7>
      <v-card-title primary-title>
        <div>
          <div class="headline">Nurses</div>
          <div>{{nurses}}</div>

        </div>
      </v-card-title>
    </v-flex>
    <v-flex xs5>
      <v-img
      src="https://image.flaticon.com/icons/png/512/1021/1021800.png"
      height="125px"
      contain
      ></v-img>
    </v-flex>
  </v-layout>
  <v-divider light></v-divider>
  <v-card-actions class="pa-3">
    <v-btn to="/admin/users" flat color="white">View More</v-btn>

  </v-card-actions>
</v-card>
</v-flex>
<v-flex  sm6
xs12
md6
lg3 style="padding:10px;">
<v-card color="blue" class="white--text">
  <v-layout row>
    <v-flex xs7>
      <v-card-title primary-title>
        <div>
          <div class="headline">Doctors</div>
          <div>{{doctors}}</div>

        </div>
      </v-card-title>
    </v-flex>
    <v-flex xs5>
      <v-img
      src="https://image.flaticon.com/icons/png/512/1021/1021799.png"
      height="125px"
      contain
      ></v-img>
    </v-flex>
  </v-layout>
  <v-divider light></v-divider>
  <v-card-actions class="pa-3">
    <v-btn to="/admin/users" flat color="white">View More</v-btn>

  </v-card-actions>
</v-card>
</v-flex>
<v-flex  sm6
xs12
md6
lg3 style="padding:10px;">
<v-card color="purple" class="white--text">
  <v-layout row>
    <v-flex xs7>
      <v-card-title primary-title>
        <div>
          <div class="headline">Clinician</div>
          <div>{{clinicians}}</div>

        </div>
      </v-card-title>
    </v-flex>
    <v-flex xs5>
      <v-img
      src="https://image.flaticon.com/icons/png/512/920/920988.png"
      height="125px"
      contain
      ></v-img>
    </v-flex>
  </v-layout>
  <v-divider light></v-divider>
  <v-card-actions class="pa-3">
    <v-btn to="/admin/users" flat color="white">View More</v-btn>

  </v-card-actions>
</v-card>
</v-flex>
</v-layout>
<v-layout>

  <v-container class="my-5">
    <span class="title">Today's Requests</span>
    <v-layout row justify-right>
      <v-flex sm12 md6>
        <v-layout row wrap>
        </v-layout>
      </v-flex>
      <v-flex sm12 md6 offset-md2 text-xs-right>
          <!--   <v-toolbar
              dense
              floating
            >
            <v-text-field
              hide-details
              prepend-icon="search"
              single-line
              v-model="search"
              label="Search"
              v-on:keyup.enter="initialize()"
            ></v-text-field>

          </v-toolbar> -->

        </v-flex>
      </v-layout>
      <v-data-table
      :headers="headers"
      :items="requests"
      hide-actions
        :search="search"
      class="elevation-1"
      >
      <template slot="items" slot-scope="props">
          <td>{{ props.item.id }}</td>
          <td class="text-xs-left">{{ props.item.requester.first_name }} {{ props.item.requester.last_name }}</td>
          <td class="text-xs-left">{{ props.item.recipient.first_name  }} {{ props.item.recipient.last_name  }}</td>
          <td class="text-xs-left">{{ props.item.recipient.health_worker_profile.worker_category.name }}</td>
          <td class="text-xs-left">{{ props.item.from }}</td>
          <td class="text-xs-left">{{ props.item.to }}</td>
          <td class="text-xs-left">{{ props.item.status.name }}</td>

        

       <!--  <td class="justify-center layout px-0">

          <v-btn
          outline
          small
          title="Edit"
          color="teal"
          flat
          @click="editItem(props.item)">
          Edit
          <v-icon right dark>edit</v-icon>
        </v-btn>
        <v-btn
        outline
        small
        title="Edit"
        color="green"
        flat
        @click="itemStock(props.item)">
        Check Stock
        <v-icon right dark>book</v-icon>
      </v-btn>
      <v-btn
      outline
      small
      title="Delete"
      color="pink"
      flat
      @click="deleteItem(props.item)">
      Delete
      <v-icon right dark>delete</v-icon>
    </v-btn>
  </td> -->
</template>
</v-data-table>
<div v-if="length" class="text-xs-center">
  <v-pagination
  :length="length"
  :total-visible="pagination.visible"
  v-model="pagination.page"
  @input="initialize"
  circle>
</v-pagination>
</div>
</v-container>

</v-layout>


</v-container>



</div>

</template>


<script>
  import apiCall from '../../utils/api'
  import { mapGetters, mapState } from 'vuex'

  export default {
    name:'Dashboard',
    computed: {
      ...mapGetters(['isAuthenticated', 'isProfileLoaded']),
    },
    data: () => ({
      users_count: '',
      doctors:'',
      nurses:'',
      pharmacist:'',
      clinicians:'',
      bookings_cancelled:'',
      revenue:'',
      complete:'',
      pending:'',
      rejected:'',
      facilities:'',
      DailyRequest:[],
      productDialog: false,
      receiveDialog:false,
      stockdialog:false,
       loading: false,
      valid: true,
      editedItem: {
        field_reservation_date: '',
        field_reservation_start_time: '',
        field_reservation_end_time: '',
        field_section_id: '',
      },
            requestItem: {
        stock_id: '',
        stock_order_product_id: '',
        quantity: '',
        stock_order_request_id: '',
        comment: '',
      },
      requests:[],
      requestIssue:[],
      headers: [
      { text: 'Date', value: 'created_at' },
      { text: 'Requester', value: 'store' },
       { text: 'Health Worker', value: 'name' },     
      { text: 'Category', value: 'supplier' },
      { text: 'Start Time', value: 'quantity' },
      { text: 'End Time', value: 'product' },
      { text: 'Status', value: 'quantity' },
      // { text: 'Actions', value: 'name', sortable: false }
      ],

       stockheaders: [
        { text: 'Lot No.', value: 'lot_no' },
        { text: 'Batch No.', value: 'batch_no' },
        { text: 'Manufacturer', value: 'manufacturer' },
        { text: 'Quantity Supplied', value: 'quantity_supplied' },
        { text: 'Quantity Issued', value: 'quantity_issued' },
        { text: 'Quantity Requested', value: 'quantity_requested' },
        { text: 'Expiry Date', value: 'expiry_date' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      item: [],
   stockDetails:[],

    }),

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        apiCall({url: '/api/countusers', method: 'GET' })
        .then(resp => {
          console.log(resp.data)
          this.users_count = resp;
        })
        .catch(error => {
          console.log(error.response)
        })


        {
          apiCall({url: '/api/countdoctors', method: 'GET' })
          .then(resp => {
            console.log(resp)
            this.doctors = resp;
          })
          .catch(error => {
            console.log(error.response)
          })
        }


        {
          apiCall({url: '/api/complete', method: 'GET' })
          .then(resp => {
            console.log(resp)
            this.complete = resp;
          })
          .catch(error => {
            console.log(error.response)
          })
        }

         {
          apiCall({url: '/api/rejected', method: 'GET' })
          .then(resp => {
            console.log(resp)
            this.rejected = resp;
          })
          .catch(error => {
            console.log(error.response)
          })
        }


        {
          apiCall({url: '/api/pending', method: 'GET' })
          .then(resp => {
            console.log(resp)
            this.pending = resp;
          })
          .catch(error => {
            console.log(error.response)
          })
        }


        {
          apiCall({url: '/api/countfacilities', method: 'GET' })
          .then(resp => {
            console.log(resp)
            this.facilities = resp;
          })
          .catch(error => {
            console.log(error.response)
          })
        }
        {
          apiCall({url: '/api/countpharmacist', method: 'GET' })
          .then(resp => {
            console.log(resp)
            this.pharmacist = resp;
          })
          .catch(error => {
            console.log(error.response)
          })
        }
        {
          apiCall({url: '/api/countclinicians', method: 'GET' })
          .then(resp => {
            console.log(resp)
            this.clinicians = resp;
          })
          .catch(error => {
            console.log(error.response)
          })
        }

 {
          apiCall({url: '/api/countnurses', method: 'GET' })
          .then(resp => {
            console.log(resp)
            this.nurses = resp;
          })
          .catch(error => {
            console.log(error.response)
          })
        }

       {
          apiCall({url: '/api/dailyrequest', method: 'GET' })
          .then(resp => {
            console.log(resp)
            this.requests = resp;
          })
          .catch(error => {
            console.log(error.response)
          })
        }



      },

 close () {
        this.dialog = false
        this.stockdialog=false
        // if not saving reset dialog references to datatables
        if (!this.saving) {
          this.resetDialogReferences();
        }
      },
      editItem (item) {
        this.editedIndex = this.item.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        this.editedItem.curr_balance=item.quantity
      },

      itemStock(item){
        this.stockItem.id = item.id
        this.stockItem.product_id = item.product_id


        apiCall({url: '/api/stockDetails/'+item.product_id, method: 'GET' })
        .then(resp => {
          console.log("Request ID is");
          this.stockDetails = resp;
          console.log("stockDetails Quantity",this.stockItem.stock_order_request_id); 
        })
        .catch(error => {
          console.log(error.response);
        });
        this.receiveDialog = true
      },





    }



  }
</script>
