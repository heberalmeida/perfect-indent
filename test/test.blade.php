{{-- Blade - Mal indentado propositalmente --}}
@extends('layouts.app')
@section('content')
<div class="container">
<h1>{{ $title }}</h1>
@if(count($users) > 0)
<ul>
@foreach($users as $user)
<li>
{{ $user->name }}
@if($user->isAdmin())
<span class="badge">Admin</span>
@endif
</li>
@endforeach
</ul>
@else
<p>No users found.</p>
@endif
@auth
<button @click="handleClick">Click me</button>
@endauth
</div>
@endsection

