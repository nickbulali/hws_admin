<template>
	<div id="login_div"> 
    <v-snackbar v-model="snackbar" :timeout="5000" bottom
	        right :color="snackbarColor">
    <span>{{message}}</span>
  </v-snackbar>
  <v-container class="mb-5">
    <div class="mb-5">
    	<v-layout row justify-center class="mt-5">
    		<v-card elevation="0" max-width="500">
    			<v-card-title primary-title>
			          <div class="black--text darken-1 display-2 font-weight-black mb-3" style="font-family: Arial, Helvetica, sans-serif;">Create New Password</div>
			        </v-card-title>
		          <v-card-text>
		            <v-form
		              ref="resetform"
		              v-model="validReset"
		              lazy-validation
		            >
		                <v-layout row wrap>
		                  
		                  <v-flex xs12>
		                    <v-text-field
		                     type="password"
		                      label="Password"
		                      v-model="password.password"
		                      :rules="passwordRules"
		                      flat
		                      prepend-inner-icon="lock"
		                    ></v-text-field>
		                  </v-flex>
		                  <v-flex xs12>
		                    <v-text-field
		                     type="password"
		                      label="Confirm Password"
		                      v-model="password.password_confirmation"
		                      :rules="passwordRules"
		                      flat
		                      prepend-inner-icon="lock"
		                    ></v-text-field>
		                  </v-flex>
		                  <v-flex xs12>
		                    <v-btn depressed round block class="text-none primary mt-4 blue--text" :disabled="!validReset" :loading="resetLoader" @click="resetPass">Reset</v-btn>
		                  </v-flex>
		                </v-layout>
		              </v-form>
		          </v-card-text>
		      </v-card>
		  </v-layout>
		  <AuthPopUp v-model='loginCardState'/>
		</div>
	</v-container>
</div>
</template>
<script>
	import apiCall from '@/utils/api'
   import AuthPopUp from '@/components/auth/authPopUp'
	import {mapGetters, mapActions} from 'vuex'
	export default {
		components: {
	      AuthPopUp
	    },
		data: () => {
    		return {
    			validReset: true,
    			resetLoader: false,
    			password: {
    				password: '',
    				password_confirmation: '',
    				email: '',
    				token: ''
    			},
    			snackbar: false,
				snackbarColor: '',
				message: '',
				passwordRules: [
					v => !!v || 'Password is required'
				],
	    	};
	    },
	    created(){
	    	this.initialize()
	    },
	    methods: {
	    	initialize(){
	    		this.password.email = this.$route.params.email
	    		this.password.token = this.$route.params.token
	    	},
	    	resetPass(){
		        if (this.$refs.resetform.validate()) {
			          if(this.password.password != this.password.password_confirmation){
			          	this.message = "Passwords do not match"
			              this.snackbarColor = "error"
			              this.snackbar = true           
			              this.resetLoader = false
			          }else{

			          this.resetLoader = true
			          apiCall({url: "/api/password/reset", data: this.password, method: 'POST'})
			          .then(resp => {
			              this.message = "Password Reset Successful"
			              this.snackbarColor = "success"
			              this.snackbar = true           
			              this.resetLoader = false
			          })
			          .catch(error => {
			            this.message = "Someting Went Wrong"
			            this.snackbarColor = "error"
			            this.snackbar = true
			            this.resetLoader = false
			          });
			      }
		        }
		      },
	    },
	    computed: {
	    	...mapGetters([
		        'loginCardState'
		      ]),
	    }
	}
</script>
