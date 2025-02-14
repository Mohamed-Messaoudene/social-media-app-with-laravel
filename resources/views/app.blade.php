
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @viteReactRefresh
    @vite(['resources/js/app.jsx']) <!-- Vite setup for React -->
</head>
<style>
    html, body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    overflow: hidden; /* Prevent scrollbars if not needed */
}
</style>
<body>
    <!-- Inertia's root element -->
    <div id="app" data-page="{{ json_encode($page) }}"> </div> 

    
     
</body>
</html>
