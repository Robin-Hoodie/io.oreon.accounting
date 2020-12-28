<template>
  <form
    class="invoice-upload"
    @submit.prevent="onSubmit"
  >
    <label for="year">
      Year
    </label>
    <input
      id="year"
      v-model="year"
      type="text"
    >

    <label for="quarter">
      Quarter
    </label>

    <select
      id="quarter"
      v-model="quarter"
    >
      <option disabled />
      <option value="Q1">
        Q1
      </option>
      <option value="Q2">
        Q2
      </option>
      <option value="Q3">
        Q3
      </option>
      <option value="Q4">
        Q4
      </option>
    </select>

    <label for="invoice">
      Invoice
    </label>
    <input
      id="invoice"
      type="file"
      @change="onUploadFile"
    >

    <button type="submit">
      Submit
    </button>
  </form>
</template>

<script lang="ts">
import axios from "axios";
import { reactive, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { gql } from "@apollo/client/core";

const signedUrlQuery = gql`
    query signedUrlForUpload($year: String!, $quarter: String!, $filename: String!) {
        signedUrlForUpload (year: $year, quarter: $quarter, filename: $filename)
    }
`;

export default {
  setup () {
    const state = reactive({
      year: "2020",
      quarter: "Q1"
    });
    const queryOptions = reactive({
      enabled: false
    });

    const file = ref<File | null>(null);

    const { onResult, variables } = useQuery<{ signedUrlForUpload: string }>(signedUrlQuery, {
      year: state.year,
      quarter: state.quarter,
      filename: file.value?.name
    }, queryOptions);

    const onSubmit = () => {
      onResult(result => {
        axios.put(result.data.signedUrlForUpload, file.value, {
          headers: {
            "Content-Type": file.value!.type
          }
        });
      });
      variables.value = {
        ...state,
        filename: file.value!.name
      };
      queryOptions.enabled = true;
    };

    return {
      ...state,
      onUploadFile: (event: InputEvent) => {
        file.value = (event.target as HTMLInputElement).files![0];
      },
      onSubmit
    };
  }
};
</script>

<style
  lang="scss"
  scoped
>
.invoice-upload {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
</style>

