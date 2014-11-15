subroutine numfor()
    open(12,file='test.txt',status='replace')
    write(12,*) "Hello, Django! I'm Fortran!"
    close(12)
end subroutine numfor