# crypto-rates
Computes exchanges rates using CoinGecko's API. Supports thousands of cryptos and limits API calls and caches rates into MongoDB. Was originally going to be a back-end application that computes Defi taxes but I decided it would be better to be its own application.
# How to Use
NOTE: this project was made enitrely with free services and doesnt require an API key which makes it slow at times. Despite that, its pretty fast after rates are cached. If they arent cached yet, you can expect it to take about a second per rate.

Also, the precision of the rate to the provided timestamp is within 1 hour and if there is an error getting the rate it will return with a value of -1.

Heres how requests should be made and what you can expect for a response:

<img width="852" alt="Screen Shot 2022-08-13 at 8 32 46 AM" src="https://user-images.githubusercontent.com/91311589/184496424-72a09e13-706f-4aef-8cf3-1ed7a48e534c.png">


# Example

# Input

<img width="769" alt="Screen Shot 2022-08-13 at 8 44 20 AM" src="https://user-images.githubusercontent.com/91311589/184496885-fcea84a5-2a6c-4253-8d57-b4a97c4eb6ca.png">

# Output

<img width="474" alt="Screen Shot 2022-08-13 at 8 44 34 AM" src="https://user-images.githubusercontent.com/91311589/184496895-ae1d1a8b-0f4e-43dd-bb41-e51811355885.png">
