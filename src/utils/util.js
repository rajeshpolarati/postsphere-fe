import { useEffect } from "react";
import store from '../store'

export const timeAgo = (date) => {
    const now = new Date();
    const givenDate = new Date(date);
    const diffInMs = now - givenDate; // Difference in milliseconds

    const msInSeconds = 1000;
    const msInMinutes = msInSeconds * 60;
    const msInHours = msInMinutes * 60;
    const msInDays = msInHours * 24;
    const msInWeeks = msInDays * 7;
    const msInMonths = msInDays * 30; // Approximation, 30 days per month
    const msInYears = msInDays * 365; // Approximation, 365 days per year

    const diffInSeconds = diffInMs / msInSeconds;
    const diffInMinutes = diffInMs / msInMinutes;
    const diffInHours = diffInMs / msInHours;
    const diffInDays = diffInMs / msInDays;
    const diffInWeeks = diffInMs / msInWeeks;
    const diffInMonths = diffInMs / msInMonths;
    const diffInYears = diffInMs / msInYears;
    let time = null;
    if (diffInYears >= 1) {
        time = Math.floor(diffInYears)
        return `${time} ${time > 1 ? 'years': 'year' } ago`;
    } else if (diffInMonths >= 1) {
        time = Math.floor(diffInMonths)
        return `${time} ${time > 1 ? 'months': 'month' } ago`;
    } else if (diffInWeeks >= 1) {
        time = Math.floor(diffInWeeks)
        return`${time} ${time > 1 ? 'weeks': 'week' } ago`;
    } else if (diffInDays >= 1) {
        time = Math.floor(diffInDays)
        return`${time} ${time > 1 ? 'days': 'day' } ago`;
    } else if (diffInHours >= 1) {
        time = Math.floor(diffInHours)
        return`${time} ${time > 1 ? 'hours': 'hour' } ago`;
    } else if (diffInMinutes >= 1) {
        time = Math.floor(diffInMinutes)
        return`${time} ${time > 1 ? 'minutes': 'minute' } ago`;
    } else {
        time = Math.floor(diffInSeconds)
        return`${time} ${time > 1 ? 'seconds': 'second' } ago`;
    }
}

export const usePostSetLoading = value => {
    useEffect(() => {
      store.dispatch({
        type: `TOGGLE_SHOW_POST_LOADING`,
        payload: {
          value
        }
      });
    }, [value]);
};

export const handleSuccesToast = (message, toast) => {
    toast({
        description: message,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
  });
}
export const getName = (person) => {
    return `${person?.firstName || ''} ${person?.lastName || ''}`.toUpperCase()
}