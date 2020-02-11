<template>
  <div id="login_div"> 
    <v-snackbar v-model="snackbar" :timeout="4000" top :color="snackbarColor">
      <span>{{message}}</span>
      <v-btn flat color="white" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-layout row justify-center class="mt-5">
      <v-card class="elevation-0 mt-5">
        <v-card-title primary-title>
          <div class="black--text darken-1 display-2 font-weight-black mb-3" style="font-family: Arial, Helvetica, sans-serif;">Reset Password</div>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-layout row wrap>
              <v-flex xs12 sm12 md12>
                <v-text-field
                  v-model="data.email"
                  :rules="emailRules"
                  prepend-icon="person"
                  name="username"
                  label="E-mail"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions class="mb-5">
          <v-layout column class="ma-1">
            <v-flex xs12 class="mb-5">
              <v-btn depressed round block color="primary" :disabled="!valid" @click="reset" :loading="loading">
                Reset
              </v-btn>
            </v-flex>
          </v-layout>
          
          
        </v-card-actions>
      </v-card>
    </v-layout>
    <AuthPopUp v-model='loginCardState'/>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import AuthPopUp from '@/components/auth/authPopUp'
  import apiCall from '../../utils/api'
  export default {
    components: {
      AuthPopUp
    },
    name: 'ResetPass',
    data: () => {
      return {
        snackbar: false,
        snackbarColor: '',
        loading: false,
        valid: true,
        message: '',
        data: {
          email: '',
        },        
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid'
        ],
      };
    },
    methods: {
      reset: function () {
        if (this.$refs.form.validate()) {
          this.loading = true
          apiCall({url: "/api/password/create", data: this.data, method: 'POST'})
          .then(resp => {
              this.message = "Email with Instructions Sent Successfully"
              this.snackbarColor = "success"
              this.loading = false
              this.snackbar = true           
              this.resetLoader = false
          })
          .catch(error => {
            this.message = "Someting Went Wrong"
            this.snackbarColor = "error"
            this.loading = false
            this.snackbar = true
            this.resetLoader = false
          });
        }
      }
    },
    computed: {
      
    },
  }
</script>