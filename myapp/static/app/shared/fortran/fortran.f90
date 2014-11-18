!program test
    !real(kind=8):: x_k, y_k, dqx, dqy, delta, theta
    !integer:: method
    !x_k = 2
    !y_k = -3
    !delta = 0.1  
    !theta = 0.001
    !method = 0
    !call graddescent(x_k, y_k, delta, theta, method)    
!end program test

subroutine graddescent(x_k, y_k, delta, theta, method)
    real(kind=8), intent(inout):: x_k, y_k, delta, theta
    integer, intent(inout):: method
    real(kind=8):: dqx, dqy, x_prev, y_prev
    x_prev = x_k + 2 * theta
    y_prev = y_k + 2 * theta
    open(UNIT=23,FILE="plotdata.txt")
    write(23, "(F0.8,A1,F0.8)") x_k, " ", y_k
    !print *, "x_k = ", x_k, " y_k = ", y_k, " delta = ", delta
    do while(sqrt((x_prev - x_k)**2+(y_prev - y_k)**2) > theta)
        call diff(x_k, y_k, dqx, dqy)
        x_prev = x_k
        y_prev = y_k
        if (method==1) then 
            call steep(x_k, y_k, delta)
        end if
        x_k = x_k - delta * dqx
        y_k = y_k - delta * dqy
        write(23, "(F0.8,A1,F0.8)") x_k, " ", y_k
        !print *, "x_k = ", x_k, " y_k = ", y_k, " delta = ", delta
    enddo  
    close(23)
end subroutine graddescent

subroutine diff(x_k, y_k, dqx, dqy)
    real(kind=8), intent(in):: x_k, y_k
    real(kind=8), intent(out):: dqx, dqy
    dqx = 2 * x_k + y_k - 5
    dqy = 6 * y_k + x_k + 3
end subroutine diff

subroutine steep(x_k, y_k, delta)
    real(kind=8), intent(in):: x_k, y_k
    real(kind=8), intent(inout):: delta
    real(kind=8):: c3, c4
    c3 = 2*x_k +y_k - 5
    c4 = 6*y_k + x_k + 3
    delta = (2*x_k*c3 + 6*y_k*c4 + x_k*c4 + y_k*c3 - 5*c3 + 3*c4)/( 2*c3**2 + 6*c4**2 + 2*c3*c4 )
end subroutine steep