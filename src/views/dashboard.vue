<template>
  <div class="dashboard">
  <v-snackbar v-model="snackbar" :timeout="4000" top :color="color">
    <span>{{message}}</span>
  </v-snackbar>
  <v-dialog
      v-model="filterDialog"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="secondary"
        dark
      >
        <v-card-text>
          Applying Filter
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  <v-dialog 
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
    v-model="requestDialog">
    <v-card>
	    <v-toolbar
        flat
        dark
        class="secondary"
      >
      <v-btn
          flat
          icon
          dark
          color="secondary"
          v-if="progress != 'Time' && progress != 'Category' && progress != 'Worker List' && progress != 'Profile'"
        >
          <v-icon color="secondary">keyboard_backspace</v-icon>
        </v-btn>
        <v-btn
          icon
          dark
          v-if="progress == 'Time'"
          @click="showMap"
        >
          <v-icon>keyboard_backspace</v-icon>
        </v-btn>
        <v-btn
          icon
          dark
          v-if="progress == 'Category'"
          @click="showClock"
        >
          <v-icon>keyboard_backspace</v-icon>
        </v-btn>
        <v-btn
          icon
          dark
          v-if="progress == 'Worker List'"
          @click="showCategories"
        >
          <v-icon>keyboard_backspace</v-icon>
        </v-btn>
        <v-btn
          icon
          dark
          v-if="progress == 'Profile'"
          @click="showWorkerList"
        >
          <v-icon>keyboard_backspace</v-icon>
        </v-btn>
        <v-toolbar-title>New Request</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          dark
          @click="requestDialog = false"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-progress-linear :value="progressBar"  v-if="requestDialog == true"></v-progress-linear>
        <div v-if="progress == 'Location'">
          <v-layout column>
            <v-flex xs12>
              <v-map ref="myMapRef" style="position: absolute; width: 92%; height: 85%; z-index: 2" :center="[latitude, longitude]" :zoom="15">
                <v-icondefault class="mt-5"></v-icondefault>
                <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
                <v-marker  
                  ref = "myMarker"
                  :lat-lng="[latitude, longitude]"
                  :icon="icon"
                  :draggable='true'
                >
                  <v-popup content="Me"></v-popup>
                </v-marker>
                  <v-btn class="primary white--text text-none" style="position: absolute; z-index: 500; bottom: 5%;" large  @click="newPos">Next</v-btn>



              </v-map>
            </v-flex>
          </v-layout>
        </div>
        <div v-if="progress == 'Time'">
        <v-layout justify-center row wrap>  
                <v-flex xs12 sm4 > 
                <p class="headline">Pick Time</p>
           
                <div v-if="progress == 'Time'">
                  <v-menu
                    ref="menu11"
                    v-model="menu1"
                    :close-on-content-click="false"
                    :return-value.sync="requestData.from"
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="requestData.from"
                        label="Start Time"
                        prepend-inner-icon="access_time"
                        readonly
                        v-on="on"
                        outline
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="menu1"
                      v-model="requestData.from"
                      :allowed-minutes="allowedStep"
                      full-width
                      color="blue"
                      @click:minute="$refs.menu11.save(requestData.from)"
                      format="24hr"
                      :min="now"
                    ></v-time-picker>
                  </v-menu>
                </div>
           
                <div v-if="progress == 'Time'">
                  <v-menu
                    ref="menu12"
                    v-model="menu2"
                    :close-on-content-click="false"
                    :return-value.sync="requestData.to"
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="requestData.to"
                        label="End Time"
                        prepend-inner-icon="access_time"
                        readonly
                        v-on="on"
                        outline
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="menu2"
                      v-model="requestData.to"
                      :allowed-minutes="allowedStep"
                      full-width
                      color="blue"
                      @click:minute="$refs.menu12.save(requestData.to)"
                      format="24hr"
                      :min="requestData.from"
                    ></v-time-picker>
                  </v-menu>
                </div>
     

        <v-flex xs12 sm4 > 
              <v-btn class="primary white--text text-none"  block @click="selectCategory" :loading="loading" large>Next</v-btn>
            </v-flex>
     
   </v-flex>
          </v-layout>
    </div>
        <div v-if="progress == 'Category'">
          <v-layout justify-center row wrap>  
                <v-flex xs12 sm4 > 
              <p class="headline">Pick Category</p>
            </v-flex>
            <v-flex xs12>
             <v-layout justify-center row wrap>  
                <v-flex xs12  sm4>
                  <v-layout row wrap>
                    <v-flex xs5 class="mt-2">
                    <v-card
                        elevation="0"
                        @click="pickCategory(1)"
                        :color="doctorColor" class="white--text login-circle"
                      >
                        <v-card-text>
                        <div align="center" class="mt-3">
                            <v-img
                              src="doctor.png"
                              aspect-ratio="0.7"
                            ></v-img>
                          </div>
                          <div>
                            <div align="center" class="secondary--text title mb-1 mt-2">Doctor</div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                    <v-divider vertical class="mx-4"></v-divider>
                    <v-flex xs5 class="mt-2">
                      <v-card
                        elevation="0"
                        @click="pickCategory(2)"
                        :color="nurseColor" class="white--text login-circle"
                      >
                        <v-card-text>
                        <div align="center" class="mt-3">
                            <v-img
                              src="nurse.png"
                              aspect-ratio="0.7"
                            ></v-img>
                          </div>
                          <div>
                            <div align="center" class="secondary--text title mb-1 mt-2">Nurse</div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                   <v-flex xs5 class="mt-2">
                    <v-card
                        elevation="0"
                        @click="pickCategory(3)"
                        :color="clinicalOfficerColor" class="white--text login-circle"
                      >
                        <v-card-text>
                        <div align="center" class="mt-3">
                            <v-img
                              src="clinical.png"
                              aspect-ratio="0.7"
                            ></v-img>
                          </div>
                          <div>
                            <div align="center" class="secondary--text title mb-1 mt-2">Clinical Officer</div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                    <v-divider vertical class="mx-4"></v-divider>
                    <v-flex xs5 class="mt-2">
                      <v-card
                        elevation="0"
                        @click="pickCategory(4)"
                        :color="pharmacistColor" class="white--text login-circle"
                      >
                        <v-card-text>
                        <div align="center" class="mt-3">
                            <v-img
                             src="pharmacist.png"
                              aspect-ratio="0.7"
                            ></v-img>
                          </div>
                          <div>
                            <div align="center" class="secondary--text title mb-1 mt-2">Pharmacist</div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                  
                
              
        <v-flex xs12 sm4 > 
              <v-btn class="primary white--text text-none" @click="listWorkers" :loading="loading" block>Next</v-btn>
            </v-flex>
            
                 </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
            <br>
            <br>
  

          
          </v-layout>
        </div>
        <div v-if="progress == 'Worker List'">
          <v-layout column>
            <div v-if="workers.length == 0">No Results Found</div>
            <v-flex xs12 v-for="(worker, index) in workers" :key="index" class="mb-1">
              <v-card
                elevation="0"
                class="grey lighten-4 login-circle pa-2"
                @click="goToProfile(index)"
              >
                <v-layout row wrap>
                  <v-flex xs3>
                    <v-avatar
                      size="70"
                      color="grey lighten-4"
                    >
                      <img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" alt="avatar">
                    </v-avatar>
                  </v-flex>
                  <v-flex xs9>
                    <div><b>{{worker.first_name}} {{worker.last_name}}</b></div>
                    <div class="grey--text">{{worker.health_worker_profile.worker_category.name}} - {{worker.health_worker_profile.worker_sub_category.name}}</div>
                    <div>
                      <v-rating
                      :value="worker.rating"
                      color="amber"
                      dense
                      half-increments
                      readonly
                      size="14"
                      ></v-rating>
                    </div>
                    <div class="mt-2">{{worker.health_worker_profile.bio.substring(0,80)+".."}}</div>
                    <div class="mt-1"><v-icon small class="mr-2">my_location</v-icon>{{worker.distance.toFixed(2)}}Km</div>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex xs12>
              <div v-if="workersLength" class="text-xs-center">
                  <v-pagination
                    :length="workersLength"
                    total-visible="5"
                    v-model="workersPagination.current_page"
                    @input="filterResults"
                    circle>
                  </v-pagination>
                </div>
            </v-flex>
            <v-flex xs12>
              <v-btn block depressed class="primary white--text text-none" @click="sheet = !sheet">
                Filters
              </v-btn>
            </v-flex>
            
            <v-bottom-sheet v-model="sheet">
              <v-sheet class="text-center">
                <div class="pa-2">
                  <v-layout column>
                    <v-flex xs12 class="my-1">
                      <v-layout row wrap>
                        <v-flex xs3>
                          <div class="grey--text mt-2">Gender</div>
                        </v-flex>
                        <v-flex xs9>
                          <v-chip :outline="maleOutline" :dark="darkMale" color="secondary" @click="filterGender(1)">Male</v-chip>
                          <v-chip :outline="femaleOutline" :dark="darkFemale" color="secondary" @click="filterGender(2)">Female</v-chip>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-divider class="grey--text"></v-divider>
                    <v-flex xs12 class="my-1">
                      <v-layout row wrap>
                        <v-flex xs3>
                          <div class="grey--text mt-2">Distance</div>
                        </v-flex>
                        <v-flex xs9>
                          <v-chip :outline="outline5km" :dark="dark5km" color="secondary" @click="filterDistance(1)">5Km</v-chip>
                          <v-chip :outline="outline10km" :dark="dark10km" color="secondary" @click="filterDistance(2)">10km</v-chip>
                          <v-chip :outline="outline15km" :dark="dark15km" color="secondary" @click="filterDistance(3)">15km</v-chip>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <!-- <v-divider class="grey--text"></v-divider>
                    <v-flex xs12 class="my-1">
                      <v-layout row wrap>
                        <v-flex xs3>
                          <div class="grey--text mt-2">Rating</div>
                        </v-flex>
                        <v-flex xs9>
                          <v-chip outline color="secondary">
                            Ascending
                          </v-chip>
                          <v-chip outline color="secondary">
                            Descending
                          </v-chip>
                        </v-flex>
                      </v-layout>
                    </v-flex> -->
                    <v-divider class="grey--text"></v-divider>
                    <v-flex xs12 class="my-1">
                      <v-layout row wrap>
                        <v-flex xs3>
                          <div class="grey--text mt-2">Sub Group</div>
                        </v-flex>
                        <v-flex xs9>
                          <template v-for="(job, index) in subjobs.worker_sub_category">
                            <v-chip v-if="subIndex == index" dark color="secondary" @click="filterBySubGroup(job.id, index)">{{job.name}}</v-chip>
                            <v-chip v-else outline color="secondary" @click="filterBySubGroup(job.id, index)">{{job.name}}</v-chip>
                          </template>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12>
                      <v-btn block depressed class="primary white--text text-none" @click="resetFilter" :loading="loading">
                        Reset Filters
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </div>
              </v-sheet>
            </v-bottom-sheet>
          </v-layout>           
        </div>
        <div v-if="progress == 'Profile'">
          <v-img
            height="150"
            src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
          >
            <v-layout column>
              <v-flex xs12>
                <v-avatar
                  class="profile"
                  color="grey"
                  size="164"
                  tile
                >
                  <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"></v-img>
                </v-avatar>
              </v-flex>
              <v-flex xs12>
                <div class="ma-2">
                  <div class="title white--text">{{profile.first_name}} {{profile.last_name}}</div>
                  <div class="white--text">{{profile.health_worker_profile.worker_category.name}} - {{profile.health_worker_profile.worker_sub_category.name}}</div>
                </div>
              </v-flex>
            </v-layout>
          </v-img>
          
          <div class="mt-3">{{profile.health_worker_profile.bio}}</div>
          <div class="my-4 subtitle-1 black--text">
            {{profile.health_worker_profile.residence}}
          </div>
          <div>
            <v-rating
              :value="profile.rating"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            ></v-rating>
          </div>
          <div class="grey--text mt-2"><v-icon small left>people</v-icon>{{profile.rating.toFixed(1)}}/5 ({{profile.reviewers}})</div>
          <div class="mt-2"><v-icon small left>my_location</v-icon>{{profile.distance.toFixed(2)}}Km away</div>
        
        <v-divider class="mx-4"></v-divider>
      
            <div align="center">
                <v-btn
                    :loading="loading"
                    depressed
                    class="primary white--text text-none mt-2"
                    text
                    @click="completeRequest"
                >
                    Complete
                    <v-icon right class="white--text">
                        done_all
                    </v-icon>
                </v-btn>
            </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>

  	<v-container class="my-2">
  		<v-layout column>
      <div v-if="$can('receive_service')" class="mb-2">
          <v-layout column>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs6>
                  <v-avatar
                    class="profile"
                    color="grey"
                    size="164"
                    tile
                  >
                    <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"></v-img>
                  </v-avatar>
                </v-flex>
                <v-flex xs6>
                  <v-layout column>
                    <v-flex xs12>
                      <div align="center" class="grey--text headline">{{stats.first_name}} {{stats.last_name}}</div>
                    </v-flex>
                    <v-flex xs12 class="mt-4">
                      <v-layout row wrap>
                    
                    <v-flex xs6>
                      <v-layout column>
                        <v-flex xs12>
                          <div align="center" class="grey--text title">
                            Visits
                          </div>
                        </v-flex>
                        <v-flex xs12>
                          <div align="center" class="grey--text">
                            {{stats.totalVisits}}
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs6>
                      <v-layout column>
                        <v-flex xs12>
                          <div align="center" class="grey--text title">
                            Rating
                          </div>
                        </v-flex>
                        <v-flex xs12>
                          <div align="center" class="grey--text">
                            {{stats.rating.toFixed(1)}}/5
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                    </v-flex>
                  </v-layout>
                  
                  <v-divider></v-divider>
                  <div>
                    <v-btn depressed block class="text-none orange darken-4 white--text" :loading="offlineLoading" v-if="stats.profile.active == 1" @click="goOffline">
                      Go Offline
                      <v-icon right small>settings_ethernet</v-icon>
                    </v-btn>
                    <v-btn depressed block class="text-none green darken-1 white--text" :loading="onlineLoading" v-if="stats.profile.active == 0" @click="goOnline">
                      Go Online
                      <v-icon right small>settings_input_antenna</v-icon>
                    </v-btn>
                  </div>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </div>
  		  <v-flex xs12>
          <div align="center" class="mt-3">
            <v-img
              src="home.png"
              aspect-ratio="1.9"
              max-width="200"
            ></v-img>
          </div>
        </v-flex>
        <div v-if="$can('individual_request_service') || $can('hospital_request_service')">
          <div>
           <v-flex xs12 md12>
          <div align="center" class="mt-3">

   <v-card
      class="mx-auto text-center"
      color="primary"
      dark
      max-width="600"
    >
      <v-card-text>
        <v-sheet color="rgba(0, 0, 0, .12)">
          <v-card-text>
  <v-flex xs5>
            <v-img
            src="pin.png"
            height="125px"
            contain
            ></v-img>
          </v-flex>
      </v-card-text>
        </v-sheet>
      </v-card-text>
  
   
      </v-card-text>
  
      <v-divider></v-divider>
  
      <v-card-actions class="justify-center">
        <v-btn @click="newRequest" block text color="secondary" >Request Here</v-btn>
      </v-card-actions>
    </v-card>
  </div>
            </v-flex>
            <!--<v-flex xs12>
              <div class="primary login-circle mt-3">
                <v-layout row wrap>
                  <v-flex xs3>
                    <div align="center" class="mt-3 mb-4">
                      <v-img
                        src="map.png"
                        aspect-ratio="1"
                        max-width="200"
                      ></v-img>
                    </div>
                  </v-flex>
                  <v-flex xs9>
                    <v-layout column>
                      <v-flex xs12>
                        <p class="white--text title mt-5 mb-5 ml-5">Track Here</p>
                      </v-flex>
                      <v-flex xs12>

                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </div>
            </v-flex>-->
          </div>
        </div>
        
      </v-layout>
  	</v-container>

  </div>
</template>
<style>
@import "~leaflet/dist/leaflet.css";
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
html, body {
  height: 100%;
  margin: 0;
}
</style>

<script>
  import apiCall from '@/utils/api'
  import Vue from 'vue'
  import { mapGetters, mapActions } from 'vuex'
  import 'leaflet/dist/leaflet.css'

  import * as Vue2Leaflet from 'vue2-leaflet'
  import { latLng, Icon, icon } from 'leaflet'
  import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
  import iconUrl from 'leaflet/dist/images/marker-icon.png'
  import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

  Vue.component('v-marker-cluster', Vue2LeafletMarkerCluster)

  delete Icon.Default.prototype._getIconUrl;

  Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
  });

  export default {
    components: {
      'v-map': Vue2Leaflet.LMap,
      'v-tilelayer': Vue2Leaflet.LTileLayer,
      'v-icondefault': Vue2Leaflet.LIconDefault,
      'v-marker': Vue2Leaflet.LMarker,
      'v-popup': Vue2Leaflet.LPopup
    },

    data () {
      let customicon = icon(Object.assign({},
        Icon.Default.prototype.options,
        {iconUrl, shadowUrl}
      ))

      return {
        filterDialog: false,

        offlineLoading: false,
        onlineLoading: false,
        maleOutline: true,
        femaleOutline: true,
        darkMale: false,
        darkFemale: false,

        outline5km: true,
        outline10km: true,
        outline15km: true,
        dark5km: false,
        dark10km: false,
        dark15km: false,

        subIndex: -1,
        subOutline: true,

        requestDialog: false,
        menu1: false,
        menu2: false,
        sheet: false,
        //showMap: false,
        color: '',

        snackbar: false,
        message: '',
        color: '',
        loading: false,

        doctorColor: 'transparent',
        nurseColor: 'transparent',
        clinicalOfficerColor: 'transparent',
        pharmacistColor: 'transparent',

        progress: 'Location',

        popupName: null,
        icon: customicon,
        clusterOptions: {},

        progressBar: 0,
        latitude: '',
        longitude: '',
        location: '',

        requestData: {
          location: {},
          from: null,
          to: null,
          category: null,
          workerId: null,

          genderId: null,
          distance: 50,
          subGroup: null,
        },

        workers: [],
        profile: {},

        workersPagination: {
          search: ' ',
          current_page: 1,
          per_page: 0,
          total: 0,
          visible: 10
        }
      }
    },
    created(){
      navigator.geolocation.getCurrentPosition(this.currentPosition);
      this.initialize()
    },
    mounted () {
          
        },
    watch: {
      
    },
    methods:{
      ...mapActions(['fetchstats', 'fetchWorkerCategories', 'fetchIndividualUpcoming', 'fetchIndividualHistorical', 'fetchWorkerUpcoming', 'fetchWorkerHistorical']),
      allowedStep: m => m % 5 === 0,
      initialize(){
        this.fetchstats()
        this.fetchWorkerCategories()
        this.fetchIndividualUpcoming(this.individualUpcomingPagination.current_page)
        this.fetchIndividualHistorical(this.individualHistoricalPagination.current_page)
        this.fetchWorkerUpcoming()
      },
      goOnline(){
        var formData = {
          type: 'online'
        }
        this.onlineLoading = true
        apiCall({url: '/api/user/'+this.getProfile.id, data: formData, method: 'PUT' })
          .then(resp => {
            this.stats.profile.active = 1
            this.onlineLoading = false
            this.fetchstats()
          })
          .catch(error => {
            this.onlineLoading = false
          })
      },
      goOffline(){
        var formData = {
          type: 'offline'
        }
        this.offlineLoading = true
        apiCall({url: '/api/user/'+this.getProfile.id, data: formData, method: 'PUT' })
          .then(resp => {
            this.stats.profile.active = 0
            this.offlineLoading = false
            this.fetchstats()
          })
          .catch(error => {
            this.offlineLoading = false
          })
      },
      resetFilter(){
        this.maleOutline = true
        this.femaleOutline = true
        this.darkMale = false
        this.darkFemale = false
        this.requestData.genderId = null

        this.outline5km = true
        this.outline10km = true
        this.outline15km = true
        this.dark5km = false,
        this.dark10km = false,
        this.dark15km = false,
        this.requestData.distance = 50

        this.subIndex = -1
        this.requestData.subGroup = null

        this.loading = true
        apiCall({url: '/api/userRequest?type=filter&page='+this.workersPagination.current_page, data: this.requestData, method: 'POST' })
            .then(resp => {
              this.loading = false
              this.sheet = false
              this.workers = resp.data
              this.workersPagination.current_page = resp.current_page
		          this.workersPagination.total = resp.total
		          this.workersPagination.per_page = resp.per_page

            })
            .catch(error => {
              this.loading = false
              this.message = "An Error Occured, Please Try Again."
              this.color = 'error'
              this.snackbar = true
            })
      },
      filterGender(gender){
        if(gender == 1){
          this.maleOutline = false
          this.femaleOutline = true
          this.darkMale = true
          this.darkFemale = false
          this.requestData.genderId = 1
          this.filterResults()
        } else {
          this.maleOutline = true
          this.femaleOutline = false
          this.darkMale = false
          this.darkFemale = true
          this.requestData.genderId = 2
          this.filterResults()
        }
      },
      filterDistance(distance){
        if(distance == 1){
          this.outline5km = false,
          this.outline10km = true,
          this.outline15km = true,
          this.dark5km = true,
          this.dark10km = false,
          this.dark15km = false,
          this.requestData.distance = 5
          this.filterResults()
        } else if(distance == 2){
          this.outline5km = true,
          this.outline10km = false,
          this.outline15km = true,
          this.dark5km = false,
          this.dark10km = true,
          this.dark15km = false,
          this.requestData.distance = 10
          this.filterResults()
        } else {
          this.outline5km = true,
          this.outline10km = true,
          this.outline15km = false,
          this.dark5km = false,
          this.dark10km = false,
          this.dark15km = true,
          this.requestData.distance = 15
          this.filterResults()
        }
      },
      filterBySubGroup(id, index){
        this.subIndex = index
        this.requestData.subGroup = id
        this.filterResults()
      },
      currentPosition(position){
        var vm = this
        vm.latitude = position.coords.latitude.toString()
        vm.longitude = position.coords.longitude.toString()
        Vue.set(this,"longitude", position.coords.longitude.toString())
        Vue.set(this,"latitude", position.coords.latitude.toString())

        var formData = {
          longitude: vm.longitude,
          latitude: vm.latitude
        }

        console.log(formData)

        apiCall({url: '/api/userDevice', data: formData, method: 'POST' })
          .then(resp => {

          })
          .catch(error => {
            
          })
      },
      showMap(){
        this.progress = 'Location'
        this.progressBar = 0
      },
      showClock(){
        this.progress = 'Time'
        this.progressBar = 25
      },
      showCategories(){
        this.progress = 'Category'
        this.progressBar = 50
      },
      showWorkerList(){
        this.progress = 'Worker List'
        this.progressBar = 75
      },
      newPos(){
        this.requestData.location = this.$refs.myMarker.mapObject.getLatLng()
        this.progress = 'Time'
        this.progressBar = 25
      },
      selectCategory(){
        if(this.requestData.from == null || this.requestData.to == null){
          this.message = 'Please Pick Start/End Time'
          this.snackbar = true
          this.color = 'error'
        }else{
          this.progress = 'Category'
          this.progressBar = 50
          this.menu1 = false
          this.menu2 = false
        }
        
      },
      listWorkers(){
        if(this.requestData.category == null){
          this.message = 'Please Pick a Category'
          this.snackbar = true
          this.color = 'error'
        }else{
          this.loading = true
          apiCall({url: '/api/userRequest?type=new', data: this.requestData, method: 'POST' })
            .then(resp => {
              this.loading = false
              this.workers = resp.data
              this.workersPagination.current_page = resp.current_page
		          this.workersPagination.total = resp.total
		          this.workersPagination.per_page = resp.per_page

              this.progress = 'Worker List'
              this.progressBar = 75
            })
            .catch(error => {
              this.loading = false
              this.message = "An Error Occured, Please Try Again."
              this.color = 'error'
              this.snackbar = true
            })
        }
      },
      filterResults(){
        this.filterDialog = true
          apiCall({url: '/api/userRequest?type=filter&page='+this.workersPagination.current_page, data: this.requestData, method: 'POST' })
            .then(resp => {
              this.filterDialog = false
              this.workers = resp.data
              this.workersPagination.current_page = resp.current_page
		          this.workersPagination.total = resp.total
		          this.workersPagination.per_page = resp.per_page

            })
            .catch(error => {
              this.filterDialog = false
              this.message = "An Error Occured, Please Try Again."
              this.color = 'error'
              this.snackbar = true
            })
      },
      goToProfile(index){
        this.progress = 'Profile'
        this.progressBar = 100
        this.profile = this.workers[index]
        this.requestData.workerId = this.workers[index].id
      },
      completeRequest(){
        this.loading = true
        apiCall({url: '/api/userRequest?type=complete', data: this.requestData, method: 'POST' })
          .then(resp => {
            this.loading = false
            this.progress = 'Location'
            this.progressBar = 0
            this.requestDialog = false
            this.message = "Request Completed Successfully."
            this.color = 'success'
            this.snackbar = true

            this.requestData.from = null
            this.requestData.to = null
            this.requestData.category = null
            this.requestData.workerId = ''
            this.clinicalOfficerColor = 'transparent'
            this.doctorColor = 'transparent'
            this.nurseColor = 'transparent'
            this.pharmacistColor = 'transparent'
          })
          .catch(error => {
            this.loading = false
            this.message = "An Error Occured, Please Try Again."
            this.color = 'error'
            this.snackbar = true
          })
      },
      newRequest(){
        this.requestDialog = true
        this.$nextTick(() => {
            this.$refs.myMapRef.mapObject.invalidateSize();
          })
      },
      pickCategory(category){
        if(category == 1){
          if(this.requestData.category == 1){
            this.requestData.category = null
            this.doctorColor = 'transparent'
            this.nurseColor = 'transparent'
            this.clinicalOfficerColor = 'transparent'
            this.pharmacistColor = 'transparent'
          } else {
            this.requestData.category = 1
            this.doctorColor = 'primary'
            this.nurseColor = 'transparent'
            this.clinicalOfficerColor = 'transparent'
            this.pharmacistColor = 'transparent'
          }
        } else if(category == 2){
          if(this.requestData.category == 2){
            this.requestData.category = null
            this.nurseColor = 'transparent'
            this.doctorColor = 'transparent'
            this.clinicalOfficerColor = 'transparent'
            this.pharmacistColor = 'transparent'
          } else {
            this.requestData.category = 2
            this.nurseColor = 'primary'
            this.doctorColor = 'transparent'
            this.clinicalOfficerColor = 'transparent'
            this.pharmacistColor = 'transparent'
          }
        } else if(category == 3){
          if(this.requestData.category == 3){
            this.requestData.category = null
            this.clinicalOfficerColor = 'transparent'
            this.doctorColor = 'transparent'
            this.nurseColor = 'transparent'
            this.pharmacistColor = 'transparent'
          } else {
            this.requestData.category = 3
            this.clinicalOfficerColor = 'primary'
            this.doctorColor = 'transparent'
            this.nurseColor = 'transparent'
            this.pharmacistColor = 'transparent'
          }
        } else if(category == 4){
          if(this.requestData.category == 4){
            this.requestData.category = null
            this.clinicalOfficerColor = 'transparent'
            this.doctorColor = 'transparent'
            this.nurseColor = 'transparent'
            this.pharmacistColor = 'transparent'
          } else {
            this.requestData.category = 4
            this.clinicalOfficerColor = 'transparent'
            this.doctorColor = 'transparent'
            this.nurseColor = 'transparent'
            this.pharmacistColor = 'primary'
          }
        }         

      }
    },
    computed: {
      ...mapGetters([
        'getProfile',
        'stats',
        'allWorkerCategories',
        'individualUpcomingPagination',
        'individualHistoricalPagination'
      ]),
      now(){
        var today = new Date();
        var now = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return now
      },
      workersLength: function() {
	        return Math.ceil(this.workersPagination.total / this.workersPagination.per_page);
	    },
      subjobs(){
        return this.$store.getters.allWorkerCategories.find((category) => category.id == this.requestData.category)
      },
    }

  }
</script>
