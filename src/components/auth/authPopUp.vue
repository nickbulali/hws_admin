<template>
	<div class="dashboard grey--lighten-1">
		<v-snackbar v-model="snackbar" :timeout="4000" bottom right :color="color">
			<span>{{message}}</span>
		</v-snackbar>
		<v-layout row justify-center>
			<v-dialog v-model="loginCardState" persistent transition="dialog-bottom-transition" max-width="900">
				<v-card class="elevation-1" max-width=900>
					<v-toolbar dark flat color="transparent">
						<v-spacer></v-spacer>
          <v-btn icon dark @click="changeLoginCardState">
            <v-icon large color="black">close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout column>
          <v-flex xs12>
            <v-layout row wrap>
              <v-flex class="hidden-md-and-up pa-5" v-if="level1 == true" xs12 md6 >
                <v-img src="foundation.jpeg"/>
              </v-flex>
              <v-flex class="hidden-sm-and-down pa-5" xs12 md6>
                <v-img src="foundation.jpeg"/>
              </v-flex>
            
              <v-flex xs12 md6 v-if="level1 == true">
                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                >
                  <v-card-text>
                    <v-card-title primary-title>
                      <!-- <Loading v-if='authLoading'/> -->
                      <div align="center" class="title font-weight-medium secondary--text">
                        Member Login
                      </div>
                    </v-card-title>
                    <v-text-field
                      class="text_field"
                      v-model="username"
                      :rules="emailRules"
                      prepend-icon="person"
                      name="username"
                      label="E-mail"
                      required
                    ></v-text-field>
                    <v-text-field
                      flat
                      class="text_field mt-3"
                      v-model="password"
                      prepend-icon="lock"
                      :rules="passwordRules"
                      name="password"
                      label="Password"
                      type="password"
                    ></v-text-field>
                  </v-card-text>
                  <v-card-actions>
                    <!-- <div>
                      <v-btn class="white--text" flat small to="register">Create an account</v-btn>
                    </div> -->
                    <v-layout row wrap>
                      <v-flex xs12>
                        <div align="center" class="title font-weight-medium secondary--text">
                          <v-btn depressed class="mb-4 text-none" block large color="secondary" round :disabled="!valid" @click="login" :loading="loading">
                            Login
                              <v-icon dark right>check_circle</v-icon>
                          </v-btn>
                        </div>
                      </v-flex>
                      <v-flex xs12>
                        <v-layout row wrap>
                          <v-flex xs12 md6>
                            <div align="left">
                              <v-btn small class="mx-2 mb-3 text-none" large flat router to="/reset-password">
                                <a>Forgot Password?</a>
                              </v-btn>
                            </div>
                          </v-flex>
                          <v-flex xs12 md6>
                            <div align="right">
                              <v-btn small class="mx-2 mb-3 text-none" large flat @click="createAccount">
                                <a>Create an account</a>
                              </v-btn>
                            </div>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-card-actions>
                </v-form>
              </v-flex>
              <v-flex xs12 md6 v-if="level2 == true">
                <v-form
                  ref="regForm"
                  v-model="valid"
                  lazy-validation
                >
                  <v-card-text>
                    <v-card-title primary-title>
                      <!-- <Loading v-if='authLoading'/> -->
                      <v-layout row wrap>
                        <v-flex xs2>
                            <v-icon color="black" @click="goBack()">arrow_back</v-icon>
                        </v-flex>
                        <v-flex xs10>
                          <div align="left" class="title font-weight-medium secondary--text">
                            Create an Account
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-card-title>
                      <v-text-field
                        class="text_field"
                        v-model="userData.first_name"
                        :rules="nameRules"
                        prepend-icon="person"
                        name="username"
                        label="First Name"
                        required
                      ></v-text-field>
                      <v-text-field
                        class="text_field"
                        v-model="userData.last_name"
                        :rules="nameRules"
                        prepend-icon="person"
                        name="username"
                        label="Last Name"
                        required
                      ></v-text-field>
                      <v-text-field
                      class="text_field"
                        v-model="userData.phone_no"
                        :rules="nameRules"
                        prepend-icon="phone"
                        name="username"
                        label="Phone Number"
                        required
                      ></v-text-field>                  
                      <v-text-field
                         v-model="userData.email"
                        :rules="emailRules"
                        prepend-icon="person"
                        name="username"
                        label="E-mail"
                        required
                      ></v-text-field>
                      <v-text-field
                        v-model="userData.password"
                        prepend-icon="lock"
                        :rules="passwordRules"
                        name="password"
                        label="Password"
                        type="password"
                      ></v-text-field>
                      <v-text-field
                        v-model="confirmPassword"
                        prepend-icon="lock"
                        :rules="passwordRules"
                        name="password"
                        label="Confirm Password"
                        type="password"
                      ></v-text-field>
                      </v-card-text>
                      <v-card-actions>
                          <v-btn depressed class="mb-5 text-none" block large color="primary" round :disabled="!valid" @click="create" :loading="loading">
                            Register
                            <v-icon right>how_to_reg</v-icon>
                          </v-btn>

                      </v-card-actions>
                </v-form>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card>
			</v-dialog>
		</v-layout>

	</div>
</template>
<script>
  import apiCall from '../../utils/api'
  import {AUTH_REQUEST} from '@/store/actions/auth'
  import Loading from './loading'
  import { mapState, mapGetters, mapActions } from 'vuex'
  export default {
  	name: 'AuthPopUp',
    components: {
      Loading
    },
    data: () => {
    	return {
        level1: true,
        level2: false,
    	  snackbar: false,
    	  loading: false,
	      valid: true,
        confirmPassword: '',
	      password: '',
        message: '',
        color: '',
	      passwordRules: [
	        v => !!v || 'Password is required'
	      ],
	      username: '',
	      emailRules: [
	        v => !!v || 'E-mail is required',
	        v => /.+@.+/.test(v) || 'E-mail must be valid'
	      ],
        passwordConfirmRules: [
          v => !!v || 'Password Confirm is required'
        ],
        
        nameRules: [
          v => !!v || 'Name is required'
        ],
        userData: {
          first_name: '',
          password: '',
          email: '',
          last_name:'',
          phone_no:''
        }
	  };
    },

    methods: {
    	...mapActions(['changeLoginCardState']),
      reset () {
        this.$refs.regForm.reset()
      },
      login: function () {
          	console.log(this.$store)
          	if (this.$refs.form.validate()) {
          		this.loading = true
    		   const { username, password } = this
    		   this.$store.dispatch(AUTH_REQUEST, { username, password })
    		   .then((response) => {
    		   		this.$store.dispatch('changeLoginCardState')
              this.loading = false
    		     	//this.$router.push('/')
    		   }).catch((response) => {
    		   		this.snackbar = true
              this.message = "Email/Password wrong or Account is not activated"
              this.color = "error"
    		   	 	this.loading = false
    		   });
    		}
    	 },
       createAccount(){
        this.level1 = false
        this.level2 = true
       },
       goBack(){
        this.level1 = true
        this.level2 = false
       },
       create () {
        if (this.$refs.regForm.validate()) {
          if(this.confirmPassword != this.userData.password){
            this.snackbar = true;
            this.color = 'error'
            this.message = "Passwords do not match!"
          }else{
            this.loading = true
            apiCall({url: '/api/create-accout', data: this.userData, method: 'POST' })
            .then(resp => {
              this.loading = false;
              this.snackbar = true;
              this.color = 'success'
              this.message = "Account Created. We've sent you an activation link via email"
              this.$store.dispatch('changeLoginCardState')
              this.reset()
            })
            .catch(error => {
              this.loading = false;
              this.message = "Email/Phone No. specified is already in use."
              this.color = 'error'
              this.snackbar = true;
            })
          }
        }
      }
    },
    computed: {
    	...mapGetters(['loginCardState']),
	    ...mapState({
	      authLoading: state => state.auth.status === 'loading',
	    })
	  },
  }
</script>